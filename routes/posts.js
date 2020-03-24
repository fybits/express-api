const express = require('express');
const router = express.Router();
const db = require('../database/models');
const Post = db.post;
const { makeJWT, validateJWT } = require('../jwt');

router.get('/', async function(req, res, next) {
  if (!validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send('{ error: "Sign in to get access to this resource" }');
  } else {
    const posts = await Post.findAll();
    res.status(200);
    
    const strippedPosts = posts.map((p) => p.toJSON());
    res.send(JSON.stringify(strippedPosts));
  }
});

router.get('/:id', async function(req, res, next) {
  if (!validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send('{ error: "Sign in to get access to this resource" }');
  } else {
    const post = await Post.findOne({ where: { id: req.params.id }});
    if (post) {
      res.status(200);
      res.send(post.toJSON());
    } else {
      res.status(404);
      res.send('Not found');
    }
  }
});

module.exports = router;
