const express = require('express');
const router = express.Router();
const models = require('../database/models');
const { authenticate } = require('../utils/authenticate');


router.get('/',
  authenticate(),
  async (req, res) => {
    const user_id = res.locals.user.id;
    const user = await models.User.findByPk(user_id, {
      include: {
        model: models.User,
        as: 'following',
      },
    });
    const subscriptions = user.following.map((follow) => follow.id);
    const posts = await models.Post.findAll({
      include: {
        model: models.User,
        as: 'user',
        where: {
          id: [user_id, ...subscriptions],
        }
      },
      order: [['created_at', 'DESC']],
    });
    res.status(200);

    const strippedPosts = posts.map((p) => p.toJSON());
    res.send(JSON.stringify(strippedPosts));
  }
);

router.get('/:id',
  authenticate(),
  async (req, res) => {
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
);

router.post('/',
  authenticate(),
  async (req, res) => {
    const user_id = res.locals.user.id;
    const post = await models.Post.create({ user_id, ...req.body });
    res.status(200);
    res.send(post.toJSON());
  }
);

router.put('/:id',
  authenticate(),
  async (req, res) => {
    const user_id = res.locals.user.id;
    const post = await models.Post.findOne({ where: { user_id, id: req.params.id } });
    if (post) {
      post.title = req.body.title;
      post.description = req.body.description;
      post.save();
      res.status(200);
      res.send(post.toJSON());
    } else {
      res.status(404);
      res.send({ error: "Either post doesn't exist or you don't have permissions to edit it" });
    }
  }
);

router.delete('/:id',
  authenticate(),
  async (req, res) => {
    const user_id = res.locals.user.id;
    const post = await models.Post.findOne({ where: { user_id, id: req.params.id } });
    if (post) {
      post.destroy();
      res.sendStatus(204);
    } else {
      res.status(404);
      res.send({ error: "Either post doesn't exist or you don't have permissions to delete it" });
    }
  }
);

module.exports = router;
