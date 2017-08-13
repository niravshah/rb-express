var mongoose = require('mongoose');

module.exports = mongoose.model('Charge', {
  sid: {type: String},
  post: {type:mongoose.Schema.Types.ObjectId, ref:'Post', required:true},
  rb_uid: {type: String, required: true},
  stripe_charge_id: {type: String, required: true},
  cust_name: {type: String, required: true},
  cust_email: {type: String, required: true},
  amount: {type: String, required: true},
});
