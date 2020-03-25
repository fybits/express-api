const express = require('express');
const router = express.Router();
const db = require('../database/models');
const Post = db.post;
const { makeJWT, validateJWT, getPayload } = require('../jwt');


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

router.post('/', async function(req, res, next) {
  if (!validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send('{ error: "Sign in to get access to this resource" }');
  } else {
    let userId = getPayload(req.headers['access-token']).id;
    const post = await Post.create({ userId, ...req.body.post });
    res.status(200);
    res.send(post.toJSON());
  }
});

router.put('/:id', async function(req, res, next) {
  if (!validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send('{ error: "Sign in to get access to this resource" }');
  } else {
    let userId = getPayload(req.headers['access-token']).id;
    const post = await Post.findOne({ where: { userId, id: req.params.id } });
    if (post) {
      post.message = req.body.post.message;
      post.description = req.body.post.description;
      post.save();
      res.status(200);
      res.send(post.toJSON());
    } else {
      res.status(404);
      res.send({ error: "Either post doesn't exist or you don't have permissions to edit it" });
    }
  }
});

router.delete('/:id', async function(req, res, next) {
  if (!validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send('{ error: "Sign in to get access to this resource" }');
  } else {
    let userId = getPayload(req.headers['access-token']).id;
    const post = await Post.findOne({ where: { userId, id: req.params.id } });
    if (post) {
      post.destroy();
      res.sendStatus(204);
    } else {
      res.status(404);
      res.send({ error: "Either post doesn't exist or you don't have permissions to delete it" });
    }
  }
});

module.exports = router;
