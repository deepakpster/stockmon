var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contacts = new Schema({
  // data : Object,
  // id: String,
  // seen: Boolean,
  // timestamp: Number,
  // type: String,
  'addedAt': Number,
  'vid': Number,
  "portal-id": Number,
  "profile-token": String,
  "profile-url": String,
  "properties": Object,
  "identity-profiles": Object
});

module.exports = mongoose.model('Contacts', Contacts);