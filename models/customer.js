var mongoose = require('mongoose');

module.exports = mongoose.model('Customer', {
  sid: {type: String},
  stripe_customer_id: {type: String, required: true},
  email: {type: String, required: true}
});
