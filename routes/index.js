var express = require('express');
var utils = require('./api/utils');
var Post = require('../models/post');

var router = express.Router();

router.get('/', function (req, res, next) {

    var amount_raised = 500;
    var amount_saved = 25;
    var rb_pf = amount_raised * 0.02;
    var rb_cpf = amount_raised * 0.014 + 0.20;
    var rb_total = amount_raised - (rb_pf + rb_cpf);

    var jg_pf = amount_raised * 0.05;
    var jg_cpf = amount_raised * 0.0125;
    var jg_total = amount_raised - (jg_pf + jg_cpf);

    var gfm_pf = amount_raised * 0.05;
    var gfm_cpf = amount_raised * 0.035 + 0.20;
    var gfm_total = amount_raised - (gfm_pf + gfm_cpf);


    res.render('index', {
        title: 'Better Fundraising for Individuals',
        amount_raised: amount_raised, amount_saved: amount_saved,
        rb_pf: rb_pf, rb_cpf: rb_cpf, rb_total: rb_total,
        jg_pf: jg_pf, jg_cpf: jg_cpf, jg_total: jg_total,
        gfm_pf: gfm_pf, gfm_cpf: gfm_cpf, gfm_total: gfm_total
    });
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
    Post.find({
        sid: req.params.id
    }).populate('author', 'sid fname lname email avatar mobile bio')
        .populate('account', 'sid')
        .exec(function (err, posts) {
            if (err) {
                res.render('error', {message: err.message});

            } else {
                if (posts.length > 0) {

                    var post = posts[0];
                    var percent = 0;

                    if (post.target !== 0 && post.collected !== 0) {
                        percent = Math.round((post.collected / post.target) * 100);
                    }

                    var asid = "none";
                    if (post.account) asid = post.account.sid;
                    res.render('fundraiser', {post: post, percent: percent, asid: asid});
                } else {
                    res.render('error', {message: "Fundraiser with id " + req.params.id + " not found."});
                }
            }
        });
});

router.get('/fundraisers/:id/edit-author', function (req, res) {

    Post.find({
        sid: req.params.id
    }).populate('author', 'sid fname lname email avatar mobile bio').exec(function (err, posts) {
        if (err) {
            res.render('error', {message: err.message});

        } else {
            res.render('edit-author', {post: posts[0]});
        }
    });

});

router.get('/fundraisers/:id/edit', function (req, res) {
    Post.find({
        sid: req.params.id
    }).populate('author', 'sid fname lname email avatar mobile bio').exec(function (err, posts) {
        if (err) {
            res.render('error', {message: err.message});

        } else {
            res.render('fundraiser-edit', {post: posts[0]});
        }
    });

});

router.get('/fundraisers/:id/go-live', function (req, res) {

    utils.getStripeOauthLink(req.params.id, function (err, post, link) {
        if (err) {
            res.render('error', {message: err.message});
        } else {
            res.render('stripe-setup', {post: post, stripeLink: link});
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
