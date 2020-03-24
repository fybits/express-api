const express = require('express');
const router = express.Router();
const db = require('../database/models');
const Comment = db.comment;
const Post = db.post;

router.get('/', async function(req, res, next) {
  let com = await Comment.findAll({ include: [Post, { model: Comment, as: 'comments'} ] });
  com = com[2];
  console.log(com.toJSON())
  let post = await Post.findAll({ include: Comment });
  post = post[1];

  const commentable = await com.getCommentable();
  res.render('index', { title: 'Express', content: JSON.stringify(commentable.toJSON())});
});

module.exports = router;
