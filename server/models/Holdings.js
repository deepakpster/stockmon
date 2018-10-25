var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Holdings = new Schema({
  // data : Object,
  // id: String,
  // seen: Boolean,
  // timestamp: Number,
  // type: String
  average_price: Number,
  close_price: Number,
  collateral_quantity: Number,
  collateral_type: String,
  day_change: Number,
  day_change_percentage: Number,
  exchange: String,
  instrument_token: Number,
  isin: String,
  last_price: Number,
  pnl: Number,
  price: Number,
  product: String,
  quantity: Number,
  realised_quantity: Number,
  t1_quantity: Number,
  tradingsymbol: String
});

module.exports = mongoose.model('Holdings', Holdings);