'use strict';
const express = require('express');
const superagent = require('superagent');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models/db');
const {getCredentials, setCredentials} = require('./models/zCredential');
const Login = require('./models/login');
const StocksWatch = require('./models/StocksWatch');
const Holdings = require('./models/Holdings');
const Positions = require('./models/Positions');
const Orders = require('./models/Orders');


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
  getHoldings();
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
  Login.find({}, (err, logins)=>{
    logins.forEach(loginCreds=>{
      setCredentials(loginCreds.zCookie, loginCreds.zToken);
    })
  });
  io.on('connection', function(socketX) {
    socket = socketX;
    console.log('Socket Connected ...');
    loadInformation();
    setInterval(()=>{
      loadInformation();
    }, 300000)
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

function loadInformation() {
  getHoldings();
  getMarketWatch();
  getPositions();
  getOrders();
}

function getHoldings() {
  const z_creds = getCredentials();
  superagent.get(`${ZERODHA_API}/portfolio/holdings`)
    .set('x-csrftoken', z_creds.token)
    .set('x-kite-version', '1.10.2')
    .set('cookie', z_creds.cookie)
    .end((err, res) => {
      if (err) { return console.log('getHoldings:: error :: ', err); }
      const holdings = JSON.parse(res.text).data;
      Holdings.deleteMany({}).then(()=>{
        console.log('holdings::', holdings);
        Holdings.insertMany(holdings, (err, res)=>{
          if (err) throw err;
          socket.emit('holdings', holdings);
        })
      })
    });
}

function getPositions() {
  const z_creds = getCredentials();
  superagent.get(`${ZERODHA_API}/portfolio/positions`)
    .set('x-csrftoken', z_creds.token)
    .set('x-kite-version', '1.10.2')
    .set('cookie', z_creds.cookie)
    .end((err, res) => {
      if (err) { return console.log('getPositions:: error :: ', err); }
      const positions = JSON.parse(res.text).data;
      Positions.deleteMany({}).then(()=>{
        console.log('positions::', positions);
        Positions.insertMany(positions, (err, res)=>{
          if (err) throw err;
          socket.emit('positions', positions);
        })
      })
    });
}

function getOrders() {
  const z_creds = getCredentials();
  superagent.get(`${ZERODHA_API}/orders`)
    .set('x-csrftoken', z_creds.token)
    .set('x-kite-version', '1.10.2')
    .set('cookie', z_creds.cookie)
    .end((err, res) => {
      if (err) { return console.log('getOrders:: error :: ', err); }
      const orders = JSON.parse(res.text).data;
      Orders.deleteMany({}).then(()=>{
        console.log('orders::', orders);
        Orders.insertMany(orders, (err, res)=>{
          if (err) throw err;
          socket.emit('orders', orders);
        })
      })
    });
}

function getMarketWatch(){
  const z_creds = getCredentials();
  superagent.get(`${ZERODHA_API}/marketwatch`)
    .set('x-csrftoken', z_creds.token)
    .set('x-kite-version', '1.10.1')
    .set('cookie', z_creds.cookie)
    .end((err, res) => {
      if (err) { return console.log('getMarketWatch:: error :: ', err.text); }
      console.log('marketWatch:::', res.text)
      const stocksToWatch = JSON.parse(res.text).data[0].items;
      StocksWatch.insertMany(stocksToWatch, (err, res)=>{
        if (err) throw err;
        socket.emit('marketWatch', stocksToWatch);
      })
    });
}
