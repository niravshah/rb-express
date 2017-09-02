const Post = require('../../models/post');
const User = require('../../models/user');
const Account = require('../../models/account');
const Customer = require('../../models/customer');
const Charge = require('../../models/charge');
const Activity = require('../../models/activity');
const Query = require('../../models/query');
const unirest = require('unirest');

const PhoneVerification = require('../../models/phone-verification');

var bcrypt = require('bcrypt');
const saltRounds = 10;
var shortid = require('shortid');

const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);


module.exports = {

    createUser: function (email, password, fname, lname, mobile, mobileCode, callback) {
        const newUser = new User();
        newUser.sid = shortid.generate();
        newUser.email = email;
        newUser.fname = fname;
        newUser.lname = lname;
        newUser.mobile = mobile;
        newUser.mobileCode = mobileCode;
        newUser.password = bcrypt.hashSync(password, saltRounds);
        newUser.save(function (err, user) {
            callback(err, user)
        });
    },

    createPost: function (user, title, amount, currency, callback) {
        const newPost = new Post();
        newPost.title = title;
        newPost.author = user;
        newPost.sid = shortid.generate();
        newPost.target = amount;
        newPost.currency = currency;
        newPost.save(function (err, post) {
            callback(err, post)
        });
    },

    createPhoneVerification: function (number, callback) {
        const newPV = new PhoneVerification();
        newPV.sid = shortid.generate();
        newPV.number = number;
        newPV.code = shortid.generate();
        newPV.save(function (err, pv) {
            callback(err, pv);
        })
    },

    createAccount: function (token, refresh_token, external_id, livemode, scope, callback) {

        const newAccount = new Account();
        newAccount.sid = shortid.generate();
        newAccount.stripe_account_id = external_id;
        newAccount.stripe_access_token = token;
        newAccount.stripe_refresh_token = refresh_token;
        newAccount.scope = scope;

        newAccount.livemode = livemode;
        newAccount.save(function (err, account) {
            callback(err, account);
        })
    },

    createCustomer: function (email, stripe_customer_id, callback) {

        const newCustomer = new Customer();
        newCustomer.sid = shortid.generate();
        newCustomer.stripe_customer_id = stripe_customer_id;
        newCustomer.email = email;
        newCustomer.save(function (err, cust) {
            callback(err, cust);
        })

    },

    updatePostWithAccount: function (sid, account, callback) {

        Post.findOneAndUpdate({sid: sid}, {account: account}, {new: true}, function (err, post) {
            callback(err, post);
        })
    },
    updatePostStatus: function (sid, status, callback) {

        Post.findOneAndUpdate({sid: sid}, {status: status}, {new: true}, function (err, post) {
            callback(err, post);
        })
    },
    mobileSendVerificationCode: function (mobile, message, callback) {

        // callback(null, {message: "success"});
        twilio.messages.create({
                from: process.env.TWILIO_PHONE_NUMBER,
                to: mobile,
                body: message
            },
            function (err, message) {
                if (err) {
                    callback({message: err.message}, null);
                } else {
                    callback(null, {message: message.status});
                }
            }
        );
    },
    shortid: function () {
        return shortid.generate();
    },
    createCharge: function (rb_uid, post, stripe_charge_id, cust_name, cust_email, amount, callback) {
        const newCharge = new Charge();
        newCharge.sid = shortid.generate();
        newCharge.rb_uid = rb_uid;
        newCharge.post = post;
        newCharge.stripe_charge_id = stripe_charge_id;
        newCharge.cust_name = cust_name;
        newCharge.cust_email = cust_email;
        newCharge.amount = amount;
        newCharge.save(function (err, charge) {
            callback(err, charge);
        })
    },
    createActivity: function (post, donor, amount, message, callback) {
        const newActivity = new Activity();
        newActivity.sid = shortid.generate();
        newActivity.post = post;
        newActivity.donor = donor;
        newActivity.amount = amount;
        newActivity.message = message;
        newActivity.save(function (err, activity) {
            callback(err, activity)
        })
    },
    createQuery: function (fname, lname, email, mobile, query, existingUser, callback) {
        const newQuery = new Query();
        newQuery.sid = shortid.generate();
        newQuery.fname = fname;
        newQuery.lname = lname;
        newQuery.email = email;
        newQuery.mobile = mobile;
        newQuery.query = query;
        newQuery.existingUser = existingUser;
        newQuery.save(function (err, query) {
            callback(err, query)
        });
    },
    getStripeAuthCode: function (post_sid, grant_code, cb) {

        var _this = this;

        Post.find({
            sid: post_sid
        }).populate('author', 'sid fname lname email avatar mobile bio').exec(function (err, posts) {

            if (err) {
                cb(err, null);
            } else {
                if (posts.length > 0) {
                    unirest.post('https://connect.stripe.com/oauth/token')
                        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                        .send({
                            client_secret: process.env.STRIPE_KEY,
                            grant_type: 'authorization_code',
                            code: grant_code
                        })
                        .end(function (response) {
                            if (response.ok) {
                                // console.log(response.body);

                                var body = response.body;
                                var access_token = body.access_token;
                                var refresh_token = body.refresh_token;
                                var stripe_user_id = body.stripe_user_id;
                                var scope = body.scope;
                                var livemode = body.livemode;

                                _this.createAccount(access_token, refresh_token, stripe_user_id, livemode, scope, function (err, account) {
                                    if (err) {
                                        cb(err, null);
                                    } else {
                                        _this.updatePostWithAccount(post_sid, account, function (err, post) {
                                            if (err) {
                                                cb(err, null);
                                            } else {
                                                cb(null, post);
                                            }
                                        });
                                    }
                                });

                            } else {
                                cb({code: response.code, message: response.body.error_description}, null);
                            }
                        });
                } else {
                    cb({message: 'Post with the id ' + post_sid + 'not found'}, null, null)
                }
            }
        });
    },
    getStripeOauthLink: function (post_sid, cb) {
        Post.find({
            sid: post_sid
        }).populate('author', 'sid fname lname email avatar mobile bio').exec(function (err, posts) {
            if (err) {
                cb(err, null, null);
            } else {

                if (posts.length > 0) {
                    var post = posts[0];
                    var oauthLink = 'https://connect.stripe.com/oauth/authorize'
                        + '?client_id=' + process.env.STRIPE_CA
                        + '&scope=read_write'
                        + '&response_type=code'
                        + '&state=' + post.sid
                        + '&stripe_user[first_name]=' + post.author.fname
                        + '&stripe_user[last_name]=' + post.author.lname
                        + '&stripe_user[product_description]=' + post.title
                        + '&stripe_user[business_type]=sole_prop'
                        + '&stripe_user[url]=' + 'https://raisebetter.uk/fundraisers/' + post.sid
                        + '&stripe_user[business_name]=' + post.title
                        + '&stripe_user[phone_number]=' + post.author.mobile
                        + '&stripe_user[email]=' + post.author.email;
                    cb(null, post, oauthLink);

                } else {
                    cb({message: 'Post with the id ' + post_sid + 'not found'}, null, null)
                }
            }
        });
    }
};
