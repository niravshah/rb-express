var express = require('express');
var router = express.Router();
var stripe = require('stripe')(process.env.STRIPE_KEY);
var unirest = require('unirest');
var utils = require('./utils');

var Post = require('../../models/post');
var Account = require('../../models/account');

module.exports = function (passport) {


    router.post('/api/stripe/charge', passport.authenticate('jwt', {
            failWithError: true
        }), function (req, res, next) {
            // console.log('POST /api/stripe/charge', req.body);
            var post = req.body.post;
            Post.findOne({sid: post}).populate('account').exec(function (err, post1) {

                if (err) {
                    return res.status(500).json({message: err.message});
                } else {
                    var rb_uid = utils.shortid();
                    var token = req.body.token;
                    var cust_email = req.body.attributes.email;
                    var cust_name = req.body.attributes.name;
                    var cust_message = req.body.attributes.message;
                    var destination_account = post1.account.stripe_account_id;
                    var description = rb_uid + ' - Raise Better Donation for ' + post1.title;
                    var statement_descriptor = 'RaiseBetter ' + rb_uid;

                    var charge_amount = req.body.attributes.amount * 100;
                    var rb_fees = charge_amount * 0.015;

                    stripe.charges.create({
                            amount: charge_amount,
                            currency: "gbp",
                            source: token.id,
                            application_fee: rb_fees,
                            description: description,
                            receipt_email: cust_email,
                            statement_descriptor: statement_descriptor
                        },
                        {stripe_account: destination_account}
                    ).then(function (charge) {

                        if (charge.status == "succeeded") {

                            var charge_amount_pounds = charge.amount / 100;
                            post1.collected = post1.collected + charge_amount_pounds;
                            post1.save(function (err, updatedPost) {
                                if (err) {
                                    res.status(500).json({
                                        message: 'Charge Successful. Could not update Post.',
                                        error: err
                                    });
                                } else {
                                    utils.createCharge(rb_uid, updatedPost, charge.id, cust_name, cust_email, charge_amount_pounds, function (err, charge) {
                                        if (err) {
                                            res.status(500).json({
                                                message: 'Charge Successful. Could not save Charge.',
                                                error: err
                                            });
                                        } else {
                                            utils.createActivity(updatedPost, cust_name, charge_amount_pounds, cust_message, function (err, act) {
                                                if (err) {
                                                    res.status(500).json({
                                                        message: 'Charge Successful. Could not save Activity.',
                                                        error: err
                                                    });
                                                } else {
                                                    res.json({message: 'Charge Successful', charge: charge});
                                                }
                                            })
                                        }
                                    });
                                }
                            });
                        } else {
                            res.status(500).json({message: 'Charge Unsuccessful', charge: charge});
                        }
                    }).catch(function (err) {
                        res.status(500).json({message: err.message});
                    });
                }
            });
        },
        function (error, req, res, next) {
            console.log('POST Error /api/stripe/charge', req.body, error);
            return res.status(500).json({message: error.message});
        });

    router.get('/api/stripe/account/:id/status', passport.authenticate('jwt', {
            failWithError: true
        }), function (req, res, next) {

            Account.findOne({sid: req.params.id}).exec(function (err, account) {
                if (err) {
                    res.status(500).json({message: err.message});
                } else {
                    if (account) {
                        stripe.accounts.retrieve(
                            account.stripe_account_id,
                            function (err, account) {
                                if (err) {
                                    res.status(500).json({message: err.message});
                                } else {
                                    res.json({
                                        charges_enabled: account.charges_enabled,
                                        details_submitted: account.details_submitted
                                    })
                                }
                            }
                        );
                    } else {
                        res.json({
                            charges_enabled: false,
                            details_submitted: false
                        })
                    }
                }
            })
        },
        function (err, req, res, next) {
            res.status(500).json({message: err.message});
        });

    return router;
};
