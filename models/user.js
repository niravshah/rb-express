var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  sid:{type:String},
  fname: {type: String, required: true},
  lname: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, enum: ['FUNDRAISER', 'PATRON'], default: 'FUNDRAISER'},
  addressLine1: {type: String, default: ''},
  addressLine2: {type: String, default: ''},
  addressLine3: {type: String, default: ''},
  country: {type: String, default: ''},
  postcode: {type: String, default: ''},
  mobile: {type: String, default: ''},
  mobileCode: {type: String, default: ''},
  isMobileVerified: {type: Boolean, default:false},
  isEmailVerified: {type: Boolean, default:false},
  isResetPassword: {type: Boolean, default:true},
  firstLogin: {type: Boolean, default:true},
  bio: {type: String, default: ''},
  avatar: {type: String, default: '/assets/images/avatar.jpg'}
});


