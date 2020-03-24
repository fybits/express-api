const express = require('express');
const router = express.Router();
const Form = require('formidable').IncomingForm;
const crypto = require('crypto');
const db = require('../database/models');
const User = db.user;

router.post('/sign_in', async function(req, res) {
  res.setHeader('access-control-allow-origin', '*')
  res.setHeader('access-control-expose-headers', 'access-token')
  const form = new Form();
  let formData = {};
  await form.parse(req, (err, fields, files) => {
    console.log(fields);
    formData = fields;
  });
  let body = { status: 'error', errors: 'wrong credentials' };
  
  const user = await User.findOne({ where: { email: formData.email } });
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
      let JWT = {
        header: {
          alg: "HS256",
          typ: "JWT"
        },
        payload: {
          ...data,
          iat: (Date.now() / 1000 + 604800) 
        }
      }
      let header = new Buffer(JSON.stringify(JWT.header)).toString('base64');
      let payload = new Buffer(JSON.stringify(JWT.payload)).toString('base64');
      
      let firstPart = `${header}.${payload}`;
      let signature = new Buffer(crypto.createHmac('sha256', process.env.SECRET)
                        .update(firstPart)
                        .digest('hex')).toString('base64');
      let JWTtoken = `${firstPart}.${signature}`;
      res.setHeader('access-token', `${JWTtoken}`);
      res.setHeader('client', 'bruh');
      res.setHeader('uid', '228');
      console.log(`\n[==DEBUG==] Signed in with email ${user.email}`);
      res.status(200);
    }
  }
  res.send(JSON.stringify(body));
});



router.post('/', async (req, res) => {
  res.setHeader('access-control-allow-origin', '*')
  const form = new Form();
  let formData = {};
  await form.parse(req, (err, fields, files) => {
    console.log(fields);
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
  if (RegExp('\\S+@\\S+\\.\\S+', 'g').test(formData.email.trim())) {
    console.log('email valid');
    const user = await User.findOne({ where: { email: formData.email } });
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
    const user = await User.create({
      email: formData.email.trim(),
      firstName: formData.first_name.trim(),
      lastName: formData.last_name.trim(),
      password: hash
    });
    body.data = user.toJSON();
    delete body.errors;
    res.status(200);
    console.log(`\n[==DEBUG==] Registered with email ${user.email}`);
  } else {
    res.status(401);
    console.log(body);
  }
  res.send(JSON.stringify(body));
});

module.exports = router;
