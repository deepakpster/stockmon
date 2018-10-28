'use strict';
const express = require('express');
const superagent = require('superagent');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
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
        res.send(JSON.stringify({error: err})).status(500);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.parse(resp.text)).status(200);
      }
    });
});

app.get("/nifty50Gainers", (req, res) => {
  superagent.get(`${API_BASE}/gainers/niftyGainers1.json`)
    .end((err, resp) => {
      if (err) {
        res.send(JSON.stringify({error: err})).status(500);
      } else {
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
    automateStopLoss();
    setInterval(()=>{
      if(isValidTime()) {
        loadInformation();
        // setTimeout(automateStopLoss, 5000);
      }
    }, 300000)
    // socket.on('fetchStockUpdate', symbol => {
    //   superagent.get('https://www.alphavantage.co/query?')
    //   .query({
    //     apikey: '2GXQ81VRB30I9V5L',
    //     function: 'TIME_SERIES_INTRADAY',
    //     symbol: 'NSE:YESBANK',
    //     interval: '15min',
    //     outputsize: 'full'
    //   })
    //   .end((err, res) => {
    //     if (err) { return console.log(err); }
    //     console.log('Stok details:: ', res);
    //     socket.emit('stockDetailUpdated', JSON.parse(res.text));
    //   });
    // });
  });
}

function isValidTime() {
  const hhmm = moment().format('HHmm');
  const isWeekend = moment().day() === 0 || moment().day() === 6;
  return true; //!isWeekend && (hhmm >= 900 && hhmm <= 1530);
}

function loadInformation() {
  getMarketWatch();
  getPositions();
  getOrders();
  getHoldings();
}

function automateStopLoss(){
  console.log('setStopLoss');
  const p1 = Holdings.find({});
  const p2 = Positions.find({});
  const p3 = Orders.find({
    status: "PENDING",
    transaction_type: "SELL",
    order_type: "SL"
  });

  Promise.all([p1, p2, p3]).then(values=>{
    const holdings = values[0];
    const positions = values[1];
    const orders = values[2];

    //check if there are pending orders with trigger set

    //check if there are any new positions

    //check if there are any unsold holdings
    for(let i=0; i<orders.length;i++) {
      const order = orders[i];
      console.log('check pending orders');
    }
    // setStopLoss();
  })
}

function setStopLoss(order) {
  const z_creds = getCredentials();
  Object.assign({},aaaa, params);
  const params = {
    exchange: order.exchange,
    tradingsymbol: order.tradingsymbol,
    transaction_type: 'SELL',
    order_type: 'SL',
    quantity: order.quantity,
    price: order.price,
    product: order.product,
    validity: 'DAY',
    disclosed_quantity: 0,
    trigger_price: order.trigger_price,
    squareoff: 0,
    stoploss: 0,
    trailing_stoploss: 0,
    variety: order.variety,
    user_id: 'SG5393'
  };
  superagent.post(`${ZERODHA_API}/orders/regular`)
    .set('x-csrftoken', z_creds.token)
    .set('x-kite-version', '1.10.2')
    .set('cookie', z_creds.cookie)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(params)
    .end((err, res) => {
      console.log('set order', err);
    });
}

function getHoldings() {
  const z_creds = getCredentials();
  superagent.get(`${ZERODHA_API}/portfolio/holdings`)
    .set('x-csrftoken', z_creds.token)
    .set('x-kite-version', '1.10.2')
    .set('cookie', z_creds.cookie)
    .end((err, res) => {
      const holdings = JSON.parse(res.text).data;
      Holdings.deleteMany({}).then(()=>{
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
      const positions = JSON.parse(res.text).data;
      Positions.deleteMany({}).then(()=>{
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
      const orders = JSON.parse(res.text).data;
      Orders.deleteMany({}).then(()=>{
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
      const stocksToWatch = JSON.parse(res.text).data[0].items;
      StocksWatch.insertMany(stocksToWatch, (err, res)=>{
        if (err) throw err;
        socket.emit('marketWatch', stocksToWatch);
      })
    });
}
