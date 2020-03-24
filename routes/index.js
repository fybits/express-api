var express = require('express');
var router = express.Router();
var db = require('../database/models');
const Comment = db.comment;
const Post = db.post;
// var User = require('../database/models/comment')(db.sequelize, db.Sequelize.DataTypes)


/* GET home page. */
router.get('/', async function(req, res, next) {
  var com = await Comment.findAll({ include: [Post, { model: Comment, as: 'comments'} ] });
  com = com[2];
  console.log(com.toJSON())
  var post = await Post.findAll({ include: Comment });
  post = post[1];
  // console.log(post.toJSON());
  // post.Comments.forEach(comment => {
  //   console.log(comment.toJSON());
  // });
  // com.forEach(comment => {
  //   console.log('-----------------------------');
  //   console.log(comment);
  //   console.log('-----------------------------');
  // });
  const commentable = await com.getCommentable();
  res.render('index', { title: 'Express', content: JSON.stringify(commentable.toJSON())});
});

module.exports = router;
