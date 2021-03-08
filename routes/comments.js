const express = require('express');
const router = express.Router();
const models = require('../database/models');
const { authenticate } = require('../utils/authenticate');

router.get('/commentable/:type/:id',
  authenticate(),
  async (req, res) => {
    const { id, type } = req.params;

    const comments = await models.Comment.findAll({
      where: {
        commentable_type: type,
        commentable_id: id,
      },
      include: {
        model: models.User,
        as: 'user',
      },
    });
    res.status(200);
    res.send(JSON.stringify(comments));
  }
);

router.get('/',
  authenticate(),
  async (req, res) => {
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
);

router.get('/:id',
  authenticate(),
  async (req, res) => {
    const comment = await models.Comment.findOne({ where: { id: req.params.id }});
    if (comment) {
      res.status(200);
      res.send(comment.toJSON());
    } else {
      res.status(404);
      res.send('Not found');
    }
  }
);

router.post('/',
  authenticate(),
  async (req, res) => {
    const user_id = res.locals.user.id;
    const comment = await models.Comment.create({ user_id, ...req.body });
    console.log(comment)
    res.status(200);
    res.send(comment.toJSON());
  }
);

router.put('/:id',
  authenticate(),
  async (req, res) => {
    const user_id = res.locals.user.id;
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
);

router.delete('/:id',
  authenticate(),
  async (req, res) => {
    const user_id = res.locals.user.id;
    const comment = await models.Comment.findOne({ where: { user_id, id: req.params.id } });
    if (comment) {
      comment.destroy();
      res.sendStatus(204);
    } else {
      res.status(404);
      res.send({ error: "Either comment doesn't exist or you don't have permissions to delete it" });
    }
  }
);

module.exports = router;
