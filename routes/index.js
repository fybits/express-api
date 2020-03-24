const express = require('express');
const router = express.Router();
const db = require('../database/models');
const Comment = db.comment;
const Post = db.post;

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Express', content: 'text'});
});

module.exports = router;
