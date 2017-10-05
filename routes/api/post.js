const express = require('express');
const router = express.Router();

const post1 = require('../../data/post1');
const post2 = require('../../data/post2');

const Post = require('../../models/post');
const User = require('../../models/user');
const Account = require('../../models/account');
const Activities = require('../../models/activity');

const utils = require('./utils');


module.exports = function (passport) {

    router.get('/api/posts', function (req, res) {
        res.json([post1, post2]);
    });

    router.get('/api/posts/:id/activities', function (req, res) {

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


    router.get('/api/posts/:id', function (req, res) {

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

    router.patch('/api/posts/:id', function (req, res) {
        if (req.body.title) {
            req.body.slug = utils.slugify(req.body.title);
        }
        Post.findOneAndUpdate({sid: req.params.id}, req.body, {new: true}, function (err, post) {
            if (err) {
                res.status(500).json({message: "Error saving post", error: err})
            } else {
                res.json({message: "Post saved successfully", post: post})
            }
        });
    });

    router.patch('/api/posts/:id/status', function (req, res) {
        Post.findOneAndUpdate({sid: req.params.id}, req.body, {new: true}, function (err, post) {
            if (err) {
                res.status(500).json({message: "Error saving post", error: err})
            } else {
                res.json({message: "Post saved successfully", post: post})
            }
        });
    });


    router.patch('/api/posts/:id/author', function (req, res) {
        Post.find({sid: req.params.id}).populate('author', 'sid').exec(function (err, post) {
            if (err) {
                res.status(500).json({message: "Error saving post", error: err})
            } else {
                User.findOneAndUpdate({sid: post[0].author.sid}, req.body, {new: true}, function (err, user) {
                    if (err) {
                        res.status(500).json({message: "Error saving user", error: err})
                    } else {
                        res.status(200).json({message: "User saved successfully", user: user})
                    }
                });

            }
        });
    });

    router.patch('/api/posts/:id/account', function (req, res) {
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


    router.get('/api/user/posts', passport.authenticate('jwt', {
        failWithError: true
    }), function (req, res, next) {

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
    }, function (err, req, res, next) {
        res.status(403).json({'message': err, 'status': err.status});
    });

    router.post('/api/posts/new', passport.authenticate('jwt', {
        failWithError: true
    }), function (req, res) {
        utils.createPost(req.user, req.body.title, req.body.amount, req.body.currency, function (err, post) {
            if (err) {
                res.status(500).json({'message': err})
            } else {
                res.status(200).json({'message': 'Post Created', 'id': post.id})
            }
        });

    });

    router.post('/api/posts', function (req, res) {
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

                const password = utils.chancePass();
                const mobileCode = utils.chanceCode();

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
                                utils.sendFirstLoginEmail(req.body.email, password, req.body.fname, function (err, result) {
                                    if (err) {
                                        console.log('Postmark Error!!', err);
                                        res.status(500).json({
                                            message: 'Error while sending email verification code through postmark',
                                            error: err.message
                                        })
                                    } else {
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
            }

        });
    });

    router.get('/api/mailer/test', function (req, res) {
        postmark.sendEmail('nirav@raisebetter.uk', 'test', 'test');
        res.json({message: 'ok'});
    });
    return router;
};


