const express = require('express');
const router = express.Router();

var generatePassword = require('password-generator');

const post1 = require('../data/post1');
const post2 = require('../data/post2');

const Post = require('../models/post');
const User = require('../models/user');
const Account = require('../models/account');
const Activities = require('../models/activity');

const utils = require('./utils');
const mailgun = require('./mailgun');
const mailer = require('./nodemailer');
const postmark = require('./postmark');

module.exports = function (passport) {

  router.get('/api/posts', (req, res) => {
    res.json([post1, post2]);
  });

  router.get('/api/posts/:id/activities', (req, res) => {

    Post.findOne({sid: req.params.id}).exec(function (err, post) {
      if (err) {
        res.status(500).json({message: "Error retrieving Posts.", error: err})
      } else {
        Activities.find({post: post}).exec(function (err, activities) {
          if (err) {
            res.status(500).json({message: "Error retrieving Activities.", error: err})
          } else {
            res.json({activities: activities});
          }
        })
      }
    })

  });


  router.get('/api/posts/:id', (req, res) => {

    if (req.params.id === 'undefined') {
      res.json(post1);
    }

    Post.find({
      sid: req.params.id
    }).populate('author', 'sid fname lname email avatar mobile bio').exec(function (err, posts) {

      if (err) {
        res.status(500).json({
          message: "Error retrieving User posts.",
          error: err
        })

      } else {
        res.json(posts[0]);
      }

    });
  });

  router.patch('/api/posts/:id', (req, res) => {
    Post.findOneAndUpdate({sid: req.params.id}, req.body, {new: true}, function (err, post) {
      if (err) {
        res.status(500).json({message: "Error saving post", error: err})
      } else {
        res.json({message: "Post saved successfully", post: post})
      }
    });
  });

  router.patch('/api/posts/:id/status', (req, res) => {
    Post.findOneAndUpdate({sid: req.params.id}, req.body, {new: true}, function (err, post) {
      if (err) {
        res.status(500).json({message: "Error saving post", error: err})
      } else {
        res.json({message: "Post saved successfully", post: post})
      }
    });
  });


  router.patch('/api/posts/:id/author', (req, res) => {
    Post.find({sid: req.params.id}).populate('author', 'sid').exec(function (err, post) {
      if (err) {
        res.status(500).json({message: "Error saving post", error: err})
      } else {
        User.findOneAndUpdate({sid: post[0].author.sid}, req.body, {new: true}, function (err, user) {
          if (err) {
            res.status(500).json({message: "Error saving user", error: err})
          } else {
            res.json({message: "User saved successfully", user: user})
          }
        });

      }
    });
  });

  router.patch('/api/posts/:id/account', (req, res) => {
    Post.find({sid: req.params.id}).populate('account', 'sid').exec(function (err, post) {
      if (err) {
        res.status(500).json({message: "Error saving post", error: err})
      } else {
        Account.findOneAndUpdate({sid: post[0].account.sid}, req.body, {new: true}, function (err, user) {
          if (err) {
            res.status(500).json({message: "Error saving user", error: err})
          } else {
            res.json({message: "User saved successfully", user: user})
          }
        });

      }
    });
  });


  router.get('/api/user/:id/posts', passport.authenticate('jwt', {
    failWithError: true
  }), (req, res, next) => {

    Post.find({
      author: req.user
    }).populate('author', 'sid fname lname email').exec(function (err, posts) {
      //console.log(err, posts);
      if (err) {
        res.status(500).json({
          message: "Error retrieving User posts.",
          error: err
        })

      } else {
        res.json(posts);
      }

    });
  }, (err, req, res, next) => {
    res.status(403).json({'message': err, 'status': err.status});
  });


  router.post('/api/posts', (req, res) => {
    console.log('POST /posts', req.body);

    User.findOne({
      'email': req.body.email
    }, function (err, user) {
      if (err) {
        res.status(500).json({
          message: "Error creating new User. Please try again later.",
          error: err
        })
      } else if (user) {

        res.status(403).json({
          "message": "Email exists. Please login first to create a post with this email id."
        })

      } else {
        //console.log('Creating New User',req.params);

        const password = generatePassword();
        const mobileCode = generatePassword();

        utils.mobileSendVerificationCode(req.body.mobile, 'Your Raise Better Verification Code: ' + mobileCode, function (err, message) {

          if (err) {
            res.status(500).json({
              message: 'Error while sending mobile verification code',
              error: err.message
            })
          } else {

            utils.createUser(req.body.email, password, req.body.fname, req.body.lname, req.body.mobile, mobileCode, function (err, user) {
              if (err) {
                res.status(500).json({
                  message: "Error creating new User. Please try again later.",
                  error: err
                })
              } else {
                mailgun.emailLogonDetails(user, password, req.body.mobile);
                utils.createPost(user, req.body.title, req.body.amount, req.body.currency, function (err, post) {
                  if (err) {
                    res.status(500).json({'message': err})
                  } else {
                    res.status(200).json({'message': 'Post Created', 'id': post.id})
                  }
                });
              }
            });

          }
        });
      }

    });
  });

  router.get('/api/mailer/test', function (req, res) {
    postmark.sendEmail('nirav@raisebetter.uk', 'test', 'test');
    res.json({message: 'ok'});
  });
  return router;
};


