const express = require('express');
const router = express.Router();
const models = require('../database/models');
const JWT = require('../jwt');


router.get('/', async function(req, res, next) {
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    const posts = await models.Post.findAll({
      include: {
        model: models.User,
        as: 'user',
      },
    });
    res.status(200);

    const strippedPosts = posts.map((p) => p.toJSON());
    res.send(JSON.stringify(strippedPosts));
  }
});

router.get('/:id', async function(req, res, next) {
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    const post = await models.Post.findOne({
      where: { id: req.params.id },
      include: {
        model: models.User,
        as: 'user',
      },
    });
    if (post) {
      res.status(200);
      res.send(post.toJSON());
    } else {
      res.status(404);
      res.send({ error: 'Not found' });
    }
  }
});

router.post('/', async function(req, res, next) {
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    let user_id = JWT.getPayload(req.headers['access-token']).id;
    const post = await models.Post.create({ user_id, ...req.body.post });
    res.status(200);
    res.send(post.toJSON());
  }
});

router.put('/:id', async function(req, res, next) {
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    let user_id = JWT.getPayload(req.headers['access-token']).id;
    const post = await models.Post.findOne({ where: { user_id, id: req.params.id } });
    if (post) {
      post.title = req.body.post.title;
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
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    let user_id = JWT.getPayload(req.headers['access-token']).id;
    const post = await models.Post.findOne({ where: { user_id, id: req.params.id } });
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
