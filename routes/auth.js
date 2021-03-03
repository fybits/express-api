const express = require('express');
const router = express.Router();
const Form = require('formidable').IncomingForm;
const models = require('../database/models');
const crypto = require('crypto');
const JWT = require('../jwt');

router.post('/sign_in', async function(req, res) {
  const form = new Form();
  let formData = {};
  await form.parse(req, (err, fields, files) => {
    formData = fields;
  });
  let body = { status: 'error', errors: ['wrong credentials'] };

  const user = await models.User.findOne({ where: { email: formData.email } });
  res.status(401);

  if (user) {
    const hash = crypto.createHmac('sha256', process.env.SECRET)
                  .update(formData.password.trim())
                  .digest('hex');
    if (user.password === hash) {
      body.status = 'success';
      delete body.errors;
      const { password, ...data } = user.toJSON();
      body.data = data;
      let jwt = JWT.makeJWT(data, Date.now() / 1000 + 604800)

      res.setHeader('access-token', jwt);
      res.status(200);
    }
  }
  res.send(body);
});

router.post('/', async (req, res) => {
  const form = new Form();
  let formData = {};
  await form.parse(req, (err, fields, files) => {
    formData = fields;
  });
  let body = { status: 'success', errors: { password: [], password_confirmation: [], email: [], name: []} };
  if (formData.password !== formData.password_confirmation) {
    body.errors.password_confirmation.push('password are not matching');
    body.status = 'error';
  }
  if (formData.password.trim().length < 6) {
    body.errors.password.push('password too short, at least 6 characters');
    body.status = 'error';
  }
  if (!formData.first_name.trim()) {
    body.errors.name.push('name required');
    body.status = 'error';
  }
  if (/\S+@\S+\.\S+/g.test(formData.email.trim())) {
    const user = await models.User.findOne({ where: { email: formData.email } });
    if (user !== null) {
      body.errors.email.push('user with this email already registered');
      body.status = 'error';
    }
  } else {
    body.errors.email.push('not valid email address');
    body.status = 'error';
  }
  Object.keys(body.errors).forEach(errorType => {
    if (body.errors[errorType].length === 0)
      delete body.errors[errorType];
  })

  if (body.status === 'success') {
    const hash = crypto.createHmac('sha256', process.env.SECRET)
                   .update(formData.password.trim())
                   .digest('hex');
    const user = await models.User.create({
      email: formData.email.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      password: hash
    });
    body.data = user.toJSON();
    delete body.errors;
    res.status(200);
  } else {
    res.status(401);
  }
  res.send(JSON.stringify(body));
});

module.exports = router;
