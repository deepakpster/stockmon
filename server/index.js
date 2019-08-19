'use strict';
const express = require('express');
const superagent = require('superagent');
const bodyParser = require('body-parser');
const cors = require('cors');
const Contacts = require('./models/Contacts');
const SalesContacts = require('./models/SalesContacts');
const fs = require('fs');
const { Parser } = require('json2csv');
const moment = require('moment');
const db = require('./models/db');
const nodemailer = require('nodemailer');


const API_BASE = 'https://api.hubapi.com';

const app = new express();
let allContactsList = [];
let allContactsInfoList = [];
let contactsInfoProperties = [];
let socket = null;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors())

const server = app.listen(process.env.PORT || 5221, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

app.get("/emailreport", (req, res) => {
  sendEmail();
  res.send({ response: "Email sent" }).status(200);
});

app.get("/contactsync", (req, res) => {
  console.log('req', req.query);
  allContactsList = [];
  contactsInfoProperties = [];
  getContactsList(req.query.count, req.query.vidOffset);
  res.setHeader('Content-Type', 'application/json');
  res.send({status: "contact sync initiated successfully"}).status(200);
});

app.get("/contactinfosync", (req, res) => {
  syncAllContactInfo();
  res.setHeader('Content-Type', 'application/json');
  res.send({status: "contactinfosync initiated successfully"}).status(200);
});

app.get("/contactinfo", (req, res)=>{
  res.setHeader('Content-Type', 'application/json');
  const p1 = SalesContacts.find({});
  p1.then(salesContactArr=>{
    res.send({contacts: salesContactArr}).status(200);
  })
})

function getContactsList(count=100, vidOffset="") {
  superagent.get(`${API_BASE}/contacts/v1/lists/all/contacts/all`)
  .query({
    hapikey: "4fcc4a69-16b3-4e97-a4ce-d9d8b1dbc7fa",
    count,
    vidOffset
  })
  .end(async (err, resp) => {
    if (err) {
      console.log('contact list error', err)
    } else {
      const respJSON = JSON.parse(resp.text);
      allContactsList.push(respJSON.contacts);
      console.log(`Syncing contacts .... Offset: ${vidOffset}   Count: ${count}`);
      if(respJSON['has-more']) {
        getContactsList(count, respJSON['vid-offset']);
        await sleep(300);
    } else {
        const contactsArr = allContactsList.flat();
        Contacts.deleteMany({}).then(()=>{
          Contacts.insertMany(contactsArr, (err, res)=>{
            if (err) throw err;
          })
        }).then(async ()=>{
          console.log('Contact Synced Successfully.');
          console.log('Initiating Contact Information Sync ....');
          await sleep(300);
          syncAllContactInfo();
        });
      }
    }
  });
}

function syncAllContactInfo(){
  allContactsInfoList = [];
  const p1 = Contacts.find({});
  const p2 = SalesContacts.deleteMany({});
  Promise.all([p1, p2]).then(async (contactsArrArg) => {
    const contactsArr = contactsArrArg[0];
    const contactsArrLen = contactsArr.length;
    for(let i=0; i<contactsArrLen; i++) {
      const contactItem = contactsArr[i];
      const isLast = (i == contactsArrLen-1);
      console.log(`Syncing .... (${i+1}/${contactsArrLen}). VID = ${contactItem.vid}`);
      getContactInfo(contactItem.vid, isLast);
      await sleep(300);
    }
  })
}


function getContactInfo(vid, isLast) {
  superagent.get(`${API_BASE}/contacts/v1/contact/vid/${vid}/profile`)
  .query({
    hapikey: "4fcc4a69-16b3-4e97-a4ce-d9d8b1dbc7fa"
  })
  .end((err, resp) => {
    if (err) {
      console.log('error::', err)
    } else {
      const respJSON = JSON.parse(resp.text);
      const {properties} = respJSON;
      const contactObj = {
        vid: respJSON['vid']
      };
      
      for (let [prop_key, prop_val] of Object.entries(properties)) {
        contactObj[prop_key] = prop_val.value;
      }

      for (let [key, value] of Object.entries(contactObj)) {
        if(contactsInfoProperties.indexOf(key) < 0) {
          contactsInfoProperties.push(key);
        }
      }

      allContactsInfoList.push(contactObj);
      SalesContacts.create(contactObj, (err, res)=>{
        if (err) throw err;
        console.log(`Syncing ${vid} Completed. `);
      })
      if(isLast) {
        const json2csvParser = new Parser({ contactsInfoProperties, quote: ""});
        const csv = json2csvParser.parse(allContactsInfoList);
        const csvFileName = `sales_contact.csv`;
        fs.writeFile(csvFileName, csv, function (err) {
          if (err) throw err;
          console.log('file Saved!');
          sendEmail(csvFileName)
        });
      }
    }
  })
}

function sendEmail(csvFileName="sales_contact.csv") {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'deepak@agaralabs.com',
      pass: 'suscjzfjvgxlxjzs'
    }
  });

  const mailOptions = {
    from: 'deepak@agaralabs.com',
    to: 'nitish@agaralabs.com',
    subject: 'Daily Sales Contact Report',
    text: 'This is auto-generated daily sales contact report. Please find attached report',
    attachments: [
      {
       path: `./${csvFileName}`
      }
   ]
  };

  transporter.sendMail(mailOptions, (error, info) =>{
    if(error) {
        console.log('error::', error)
      } else {
        console.log('info::', info)
    }
});
}

const io = require('socket.io')(server);

main() 
function main() {
  console.log('Main initiated')
  io.on('connection', function(socketX) {
    socket = socketX;
    console.log('Socket Connected ...');
  })
}

function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}