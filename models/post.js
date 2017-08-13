var mongoose = require('mongoose');

var postSchema = mongoose.model('Post',{
  sid:{type:String},
  author: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  account: {type:mongoose.Schema.Types.ObjectId, ref:'Account'},
  type: {type:String, enum: ['other', 'charity'], default: 'other'},
  featured: {type:Boolean, default:false},
  title: {type:String, default:''},
  subTitle: {type:String, default:''},
  image: {type:String, default:'/assets/images/home1-banner0.jpg'},
  supporters: {type:Number, default:0},
  created: {type:Date, default:Date.now()},
  target: {type:Number, default:0},
  collected: {type:Number, default:0},
  currency: {type:String, default:'GBP'},
  story:{type:String, default:''},
  status: {type:String, enum: ['draft', 'live-test','live'], default: 'draft'}
});

module.exports = postSchema;
