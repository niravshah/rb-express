const express = require('express');
const router = express.Router();
const mailgun = require('./mailgun');
const utils = require('./utils');

const User = require('../models/user');

module.exports = function (passport) {

  router.post('/api/contact/query', (req, res) => {
    var data = req.body;

    if (data.existingUser != null) {
      User.findOne({
        'sid': data.existingUser
      }, function (err, user) {
        if (err) return done(err);
        else {
          data['fname'] = user.fname;
          data['lname'] = user.lname;
          data['email ']= user.email;
          data['mobile'] = user.email;
          data['existingUser'] = true;
          createQuery(data, res);
        }

      });
    } else {
      createQuery(data, res);
    }
  });

  function createQuery(data, res) {
    mailgun.emailContactQuery(data.fname, data.lname, data.email, data.mobile, data.query);
    utils.createQuery(data.fname, data.lname, data.email, data.mobile, data.query, data.existingUser, (err, resp) => {
      if (err) res.status(500).json({message: err.message});
      else res.json({ref: resp.sid})
    })
  }

  return router;
};
