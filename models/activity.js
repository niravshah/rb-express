var mongoose = require('mongoose');

module.exports = mongoose.model('Activity', {
  sid: {type: String},
  post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
  donor: {type: String, required: true},
  amount: {type: Number, required: true},
  message: {type: String},
  created: {type: Date, default: Date.now()}
});
