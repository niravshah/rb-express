const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const util = require('./utils');
const generatePassword = require('password-generator');
const User = require('../../models/user');

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (passport) {

    router.post('/api/auth/login', passport.authenticate('local', {
        failWithError: true
    }), function (req, res, next) {
        var token = jwt.sign({email: req.user.email, sid: req.user.sid}, 'shhhhh');
        res.status(200).json({'message': 'ok', 'email': req.user.email, 'sid': req.user.sid, 'token': token});
    }, function (err, req, res, next) {
        res.status(403).json({'message': err, 'id': 1});
    });

    router.post('/api/auth/reset-password', passport.authenticate('jwt', {
        failWithError: true
    }), function (req, res, next) {

        if (req.body.password === req.body.repeatPassword) {
            User.findOneAndUpdate({sid: req.user.sid, isResetPassword: true}, {
                password: bcrypt.hashSync(req.body.password, saltRounds),
                isResetPassword: false
            }, {new: true}, function (err, user) {
                if (err) {
                    res.status(403).json({'message': 'Error executing password reset.'});
                } else if (user) {
                    req.user = user;
                    var token = jwt.sign({email: req.user.email, sid: req.user.sid}, 'shhhhh');
                    res.status(200).json({
                        'message': 'ok',
                        'email': req.user.email,
                        'sid': req.user.sid,
                        'token': token
                    });
                } else {
                    res.status(403).json({'message': 'Error executing password reset.'});
                }
            });
        } else {
            res.status(403).json({'message': 'Could not reset password. Repeat Password does not match'});
        }

    }, function (err, req, res, next) {
        res.status(403).json({'message': err, 'id': 1});
    });


    router.post('/api/auth/first-login', passport.authenticate('local', {
            failWithError: true
        }), function (req, res, next) {

            if (req.user.mobileCode == req.body.mobileCode
            ) {

                User.findOneAndUpdate({sid: req.user.sid}, {
                    isEmailVerified: true,
                    isMobileVerified: true,
                    firstLogin: false
                }, {new: true}, function (err, user) {

                    if (err) {
                        res.status(403).json({'message': 'Error executing first login updates.'});
                    } else {
                        req.user = user;
                        var token = jwt.sign({email: req.user.email, sid: req.user.sid}, 'shhhhh');
                        res.status(200).json({
                            'message': 'ok',
                            'email': req.user.email,
                            'sid': req.user.sid,
                            'token': token
                        });
                    }
                });
            }
            else {
                res.status(403).json({'message': 'Could not verify mobile code'});
            }
        },
        function (err, req, res, next) {
            res.status(403).json({'message': err, 'id': 1});
        });


    router.post('/api/register', function (req, res) {

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
                util.createUser(req.body.email, password, req.body.name, function (err, user) {
                    if (err) {
                        res.status(500).json({
                            message: "Error creating new User. Please try again later.",
                            error: err
                        })
                    } else {
                        util.emailLogonDetails(user, password);
                        res.status(200).json({'message': 'ok', 'email': user.email, 'sid': user.sid});
                    }
                });
            }
        });
    });

    router.post('/api/auth/login-new-codes', function (req, res) {
        User.findOne({
            email: req.body.email,
            mobile: req.body.mobile
        }, function (err, user) {
            if (err) {
                res.status(500).json({message: "Error retrieving this user", error: err})
            } else {
                if (user) {
                    const pass = util.chancePass();
                    const code = util.chanceCode();

                    util.mobileSendVerificationCode(user.mobile, 'Your Raise Better Verification Code: ' + code, function (err, success) {
                        /*
                         if (err) {
                         res.status(500).json({message: "Error sending mobile verification code", error: err})
                         } else {
                         */

                        user.password = util.bcryptPass(pass);
                        user.mobileCode = code;
                        user.firstLogin = true;
                        user.save(function (err, user) {
                            if (err) {
                                res.status(500).json({message: "Error updating user", error: err})
                            } else {
                                util.sendFirstLoginEmail(req.body.email, pass, user.fname, function (err, result) {
                                    if (err) {
                                        res.status(500).json({message: "Error sending update email", error: err})
                                    } else {
                                        res.json({message: "ok"})
                                    }
                                })
                            }
                        })
                        //}
                    });
                } else {
                    res.status(500).json({message: "No User Found", error: err})
                }
            }
        })
    });

    return router;
};
