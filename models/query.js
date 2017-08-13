var mongoose = require('mongoose');

var schema = mongoose.model('Query', {
  sid: {type: String},
  fname: {type: String, required: true},
  lname: {type: String, required: true},
  email: {type: String, required: true},
  mobile: {type: String, required: true},
  query: {type: String, required: true},
  existingUser:{type:Boolean,default:false},
  created: {type: Date, default: Date.now()},
  last_updated: {type: Date, default: Date.now()},
  status: {type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new'}
});

module.exports = schema;
