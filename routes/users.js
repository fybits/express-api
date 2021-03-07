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

module.exports = router;
