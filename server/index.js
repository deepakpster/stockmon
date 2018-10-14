'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const app = new express();

const API_BASE = 'https://www.nseindia.com/live_market/dynaContent/live_analysis';

app.use(cors())

const server = app.listen(process.env.PORT || 5001, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
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
  io.on('connection', function(socket) {
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
