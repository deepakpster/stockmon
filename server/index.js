'use strict';

const express = require('express');
const superagent = require('superagent');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models/db');
const {getCredentials, setCredentials} = require('./models/zCredential');
const Login = require('./models/login');
const StocksWatch = require('./models/StocksWatch');


const app = new express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const API_BASE = 'https://www.nseindia.com/live_market/dynaContent/live_analysis';
const ZERODHA_API = 'https://kite.zerodha.com/api';

let socket = null;
app.use(cors())

const server = app.listen(process.env.PORT || 5001, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

app.post("/login", (req, res) => {
  const {zToken, zCookie} = req.body;
  setCredentials(zCookie, zToken);
  getMarketWatch();
  const loginObj = new Login(req.body);
  Login.deleteMany({}).then(()=>{
    loginObj.save(err=>{
      if(err) throw err;
      res.send({msg: 'login successful'}).status(200);
    })
  });
});

app.get("/nifty50Gainers", (req, res) => {
  superagent.get(`${API_BASE}/gainers/niftyGainers1.json`)
    .end((err, resp) => {
      if (err) {
        console.log('Gainers Error:', err);
        res.send(JSON.stringify({error: err})).status(500);
      } else {
        console.log('Gainers res:', resp);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.parse(resp.text)).status(200);
      }
    });
});

const io = require('socket.io')(server);

main() 

function main() {
  io.on('connection', function(socketX) {
    socket = socketX;
    console.log('Socket Connected ...');
    socket.on('fetchStockUpdate', symbol => {
      superagent.get('https://www.alphavantage.co/query?')
      .query({
        apikey: '2GXQ81VRB30I9V5L',
        function: 'TIME_SERIES_INTRADAY',
        symbol: 'NSE:YESBANK',
        interval: '15min',
        outputsize: 'full'
      })
      .end((err, res) => {
        if (err) { return console.log(err); }
        console.log('Stok details:: ', res);
        socket.emit('stockDetailUpdated', JSON.parse(res.text));
      });
    });
  });
}

function getMarketWatch(){
  console.log('getCredentials()', getCredentials());
  const z_creds = getCredentials();
  superagent.get(`${ZERODHA_API}/marketwatch`)
    .set('x-csrftoken', z_creds.token)
    .set('x-kite-version', '1.10.1')
    .set('cookie', z_creds.cookie)
    .end((err, res) => {
      if (err) { return console.log('Zerodha', err.text); }
      console.log('marketWatch:::', res.text)
      const stocksToWatch = JSON.parse(res.text).data[0].items;
      StocksWatch.insertMany(stocksToWatch, (err, res)=>{
        if (err) throw err;
        socket.emit('marketWatch', stocksToWatch);
      })
    });
}
