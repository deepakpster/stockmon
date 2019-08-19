var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SalesContacts = new Schema({
  'vid': Number,
  "firstname": String,
  "lastname": String,
  "createdate": Number,
  "customer_tag": String,
  "associatedcompanyid": Number,
  "company": String,
  "jobtitle": String,
  "n1st_email_sent_date": Number,
  "hs_email_last_open_date": Number,
  "hs_sales_email_last_clicked": Number,
});

module.exports = mongoose.model('SalesContacts', SalesContacts);