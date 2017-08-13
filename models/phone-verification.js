var mongoose = require('mongoose');

module.exports = mongoose.model('PhoneVerification', {
  sid: {type: String},
  number: {type: String, required: true},
  code: {type: String, required: true},
  status: {type: String, enum: ['new', 'verified'], default: 'new'},
  created: {type: Date, default: Date.now()},
  updated: {type: Date, default: Date.now()}
});


