var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Orders = new Schema({
  average_price: Number,
  cancelled_quantity: Number,
  disclosed_quantity: Number,
  exchange: String,
  exchange_order_id: String,
  exchange_timestamp: String,
  exchange_update_timestamp: String,
  filled_quantity: Number,
  guid: String,
  instrument_token: Number,
  market_protection: Number,
  order_id: String,
  order_timestamp: String,
  order_type: String,
  parent_order_id: String,
  pending_quantity: Number,
  placed_by: String,
  price: Number,
  product: String,
  quantity: Number,
  status: String,
  status_message: String,
  tag: String,
  tradingsymbol: String,
  transaction_type: String,
  trigger_price: Number,
  validity: String,
  variety: String
});

module.exports = mongoose.model('Orders', Orders);

