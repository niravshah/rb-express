const express = require('express');
const router = express.Router();

const google = require('googleapis');
const analytics = google.analytics('v3');

const key = require('../raise-better-d444ac78c9e0.json');
const VIEW_ID = 'ga:156277115';

module.exports = function (passport) {

  router.get('/api/analytics/test', (req, res) => {

    let jwtClient = new google.auth.JWT(key.client_email, null, key.private_key,
      ['https://www.googleapis.com/auth/analytics.readonly'], null);

    jwtClient.authorize(function (err, tokens) {

      console.log('Google APIs:', err, tokens);

      if (err) {
        console.log(err);
        return;
      }

      analytics.data.ga.get({
        'auth': jwtClient,
        'ids': VIEW_ID,
        'metrics': 'ga:sessions',
        'dimensions':'ga:userid',
        'start-date': '7daysAgo',
        'end-date': 'today',
      }, (err, response) => {
        if (err) {
          console.log(err);
          res.status(500).json({message: err.message});
        } else {
          res.json(response);
        }
      });

    });
  });


  return router;
};
