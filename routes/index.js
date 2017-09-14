var express = require('express');
var utils = require('./api/utils');
var Post = require('../models/post');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Better Fundraising for Individuals'
    });
});

router.get('/faq', function (req, res) {
    res.render('faq')
});

router.get('/login', function (req, res) {
    res.render('login')
});

router.get('/first-login', function (req, res) {
    res.render('first-login');
});

router.get('/home', function (req, res) {
    res.render('home');
});

router.get('/sign-up', function (req, res) {
    res.render('signup');
});

router.get('/info', function (req, res) {
    res.render('info', {message: req.query.message});
});

router.get('/reset-password', function (req, res) {
    res.render('reset-password');
});

router.get('/fundraisers/new', function (req, res) {
    res.render('fundraiser-new');
});


router.get('/fundraisers/:id', function (req, res) {

    utils.findPostBySlugOrId(req.params.id, function (err, post) {
        if (err) {
            res.render('error', {message: err.message});
        } else {

            var percent = 0;
            if (post.target !== 0 && post.collected !== 0) {
                percent = Math.round((post.collected / post.target) * 100);
            }

            var asid = "none";
            if (post.account) asid = post.account.sid;
            res.render('fundraiser', {post: post, percent: percent, asid: asid});

        }
    });

});

router.get('/fundraisers/:id/edit-author', function (req, res) {

    utils.findPostBySlugOrId(req.params.id, function (err, post) {
        if (err) {
            res.render('error', {message: err.message});
        } else {
            res.render('edit-author', {post: post});
        }

    });

});

router.get('/fundraisers/:id/edit', function (req, res) {

    utils.findPostBySlugOrId(req.params.id, function (err, post) {
        if (err) {
            res.render('error', {message: err.message});

        } else {
            res.render('fundraiser-edit', {post: post});
        }
    });
});

router.get('/fundraisers/:id/go-live', function (req, res) {

    utils.findPostBySlugOrId(req.params.id, function (err, post) {
        if (err) {
            res.render('error', {message: err.message});
        } else {
            utils.getStripeOauthLink(post, function (post, link) {
                res.render('stripe-setup', {post: post, stripeLink: link});
            });
        }
    });

});

router.get('/fundraisers/:id/donate', function (req, res) {

    utils.findPostBySlugOrId(req.params.id, function (err, post) {
        if (err) {
            res.render('error', {message: err.message});
        } else {
            var asid = "none";
            if (post.account) asid = post.account.sid;
            res.render('fundraiser-donate', {post: post, asid: asid});
        }
    });
});

router.get('/fundraisers/:id/share', function (req, res) {

    utils.findPostBySlugOrId(req.params.id, function (err, post) {
        if (err) {
            res.render('error', {message: err.message});

        } else {
            var asid = "none";
            if (post.account) asid = post.account.sid;
            res.render('fundraiser-share', {post: post, asid: asid, authorName: post.author.fname});
        }

    });
});


router.get('/stripe-connect', function (req, res) {
    if (req.query.error) {
        res.render('error', {message: req.query.error_description});
    } else {
        if (req.query.state) {
            if (req.query.code) {
                utils.getStripeAuthCode(req.query.state, req.query.code, function (err, post) {
                    if (err) {
                        res.render('error', {message: err.message});
                    } else {
                        utils.updatePostStatus(post.sid, 'live', function (err, post) {
                            if (err) {
                                res.render('error', {message: err.message});
                            } else {
                                res.render('stripe-redirect', {post: post});
                            }
                        });
                    }
                });

            } else {
                res.render('error', {message: "No Grant Code received from Stripe"});
            }
        } else {
            res.render('error', {message: "No Fundraiser specified"});
        }
    }

});


module.exports = router;
