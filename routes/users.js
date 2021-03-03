const express = require('express');
const router = express.Router();
const models = require('../database/models');
const JWT = require('../jwt');

router.get('/:id', async function(req, res, next) {
  if (!JWT.validateJWT(req.headers['access-token'])) {
    res.status(401);
    res.send({ error: 'Sign in to get access to this resource' });
  } else {
    const user = await models.User.findOne({ where: { id: req.params.id }});
    if (user) {
      const { password, ...data } = user.toJSON();
      res.status(200);
      res.send(data);
    } else {
      res.status(404);
      res.send('Not found')
    }
  }
});

module.exports = router;
