const express = require('express');
const router = express.Router();
const models = require('../database/models');
const { authenticate } = require('../utils/authenticate');

router.get('/:id',
  authenticate(),
  async (req, res) => {
    const user = await models.User.findByPk(req.params.id, {
      include: [
        {
          model: models.User,
          as: 'following',
        },
        {
          model: models.User,
          as: 'followers',
        },
        {
          model: models.Post,
          as: 'posts',
        }
      ],
    });
    if (user) {
      const { password, ...data } = user.toJSON();
      res.status(200);
      res.send(data);
    } else {
      res.status(404);
      res.send('Not found')
    }
  }
);


router.post('/follow/:user_id',
  authenticate(),
  async (req, res) => {
    const follower_id = res.locals.user.id;
    const { user_id } = req.params;

    const user = await models.Followers.findOne({
      where: { user_id, follower_id },
    });
    if (user) {
      user.destroy();
      res.status(200);
      res.send(false);
    } else {
      await models.Followers.create({ user_id, follower_id });
      res.status(200);
      res.send(true)
    }
  }
);

module.exports = router;
