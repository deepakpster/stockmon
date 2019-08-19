const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://admin:admin123@ds239797.mlab.com:39797/salesmanagement', {useNewUrlParser: true})
  .then(() => { // if all is ok we will be here
    console.log('MongoDB :: Connected');
  })
  .catch(err => { // if error we will be here
    console.error('App starting error:', err.stack);
    process.exit(1);
  });