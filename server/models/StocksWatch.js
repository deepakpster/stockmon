var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StocksWatch = new Schema({
  id: Number,
  weight: Number,
  tradingsymbol: String
});

module.exports = mongoose.model('StocksWatch', StocksWatch);