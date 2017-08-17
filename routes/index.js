var express = require('express');
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

module.exports = router;
