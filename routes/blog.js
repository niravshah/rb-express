const express = require('express');
const router = express.Router();

const post1 = require('../data/post1');
const post2 = require('../data/post2');


module.exports = function (passport) {

  router.get('/api/blog/posts', (req, res) => {
    res.json({posts: [post1, post2]});
  });

  router.get('/api/blog/posts/:id', (req, res) => {
    res.json({post: post1, featured: [post1, post2], others: [post1, post2]});
  });
  return router;

};
