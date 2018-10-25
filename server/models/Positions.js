var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Positions = new Schema({
  day: Array,
  net: Array
});

module.exports = mongoose.model('Positions', Positions);