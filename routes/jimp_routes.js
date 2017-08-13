const express = require('express');
const router = express.Router();

const jiimp = require('./jiimp');


module.exports = function (passport) {

  router.get('/api/jimp/fb', (req, res) => {
    jiimp.createFBImage('../../src/assets/images/home1_banner0.jpg');
    res.json({message: 'ok'});
  });


  return router;
};
