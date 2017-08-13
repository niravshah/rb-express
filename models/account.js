var mongoose = require('mongoose');

module.exports = mongoose.model('Account', {
  sid: {type: String},
  stripe_access_token: {type: String, required: true},
  stripe_account_id: {type: String, required: true},
  scope: {type: String},
  stripe_refresh_token: {type: String},
  livemode: {type: Boolean, default: false},
  status: {type: String, enum: ['draft', 'live-test', 'live'], default: 'draft'}
});
