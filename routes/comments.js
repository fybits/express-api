const express = require('express');
const router = express.Router();
const models = require('../database/models');
const JWT = require('../jwt');


router.get('/', async function(req, res, next) {
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    const comments = await models.Comment.findAll({
      include: {
        model: models.User,
        as: 'user',
      },
    });
    res.status(200);

    const strippedComment = comments.map((p) => p.toJSON());
    res.send(JSON.stringify(strippedComment));
  }
});

router.get('/:id', async function(req, res, next) {
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    const comment = await models.Comment.findOne({ where: { id: req.params.id }});
    if (comment) {
      res.status(200);
      res.send(comment.toJSON());
    } else {
      res.status(404);
      res.send('Not found');
    }
  }
});

router.post('/', async function(req, res, next) {
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    let user_id = JWT.getPayload(req.headers['access-token']).id;
    const comment = await models.Comment.create({ user_id, ...req.body });
    res.status(200);
    res.send(comment.toJSON());
  }
});

router.put('/:id', async function(req, res, next) {
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    let user_id = JWT.getPayload(req.headers['access-token']).id;
    const comment = await models.Comment.findOne({ where: { user_id, id: req.params.id } });
    if (comment) {
      comment.message = req.body.message;
      comment.save();
      res.status(200);
      res.send(comment.toJSON());
    } else {
      res.status(404);
      res.send({ error: "Either comment doesn't exist or you don't have permissions to edit it" });
    }
  }
});

router.delete('/:id', async function(req, res, next) {
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    let user_id = JWT.getPayload(req.headers['access-token']).id;
    const comment = await models.Comment.findOne({ where: { user_id, id: req.params.id } });
    if (comment) {
      comment.destroy();
      res.sendStatus(204);
    } else {
      res.status(404);
      res.send({ error: "Either comment doesn't exist or you don't have permissions to delete it" });
    }
  }
});

module.exports = router;
