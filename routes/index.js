var express = require('express');
var router = express.Router();

const Post = require('../models/post');

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

router.get('/fundraisers/:id', function (req, res) {
    Post.find({
        sid: req.params.id
    }).populate('author', 'sid fname lname email avatar mobile bio').exec(function (err, posts) {
        if (err) {
            res.render('error', {message: err.message});

        } else {
            res.render('fundraiser', {post: posts[0]});
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
            res.render('edit-fundraiser', {post: posts[0]});
        }
    });

});

router.get('/fundraisers/:id/go-live', function (req, res) {
    Post.find({
        sid: req.params.id
    }).populate('author', 'sid fname lname email avatar mobile bio').exec(function (err, posts) {
        if (err) {
            res.render('error', {message: err.message});
        } else {

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


            res.render('go-live', {post: posts[0], stripeLink: oauthLink});
        }
    });
});


module.exports = router;
