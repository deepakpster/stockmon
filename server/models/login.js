var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Login = new Schema({
  zCookie: String,
  zToken: String
});

module.exports = mongoose.model('Login', Login);