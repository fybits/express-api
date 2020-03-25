const crypto = require('crypto');

const makeJWT = (data, iat) => {
  let JWT = {
    header: {
      alg: "HS256",
      typ: "JWT"
    },
    payload: {
      ...data,
      iat
    }
  }
  let header = Buffer.from(JSON.stringify(JWT.header)).toString('base64');
  let payload = Buffer.from(JSON.stringify(JWT.payload)).toString('base64');
  
  let firstPart = `${header}.${payload}`;
  let signature = Buffer.from(crypto.createHmac('sha256', process.env.SECRET)
                    .update(firstPart)
                    .digest('hex')).toString('base64');
  let JWTtoken = `${firstPart}.${signature}`;
  return JWTtoken
};

const validateJWT = (JWT) => {
  if (!JWT) return false;
  let chunks = JWT.split('.');
  let firstPart = `${chunks[0]}.${chunks[1]}`;
  let signature = Buffer.from(crypto.createHmac('sha256', process.env.SECRET)
                    .update(firstPart)
                    .digest('hex')).toString('base64');
  return (chunks[2] === signature);
};

const getPayload = (JWT) => {
  let chunks = JWT.split('.');
  let payload = Buffer.from(chunks[1], 'base64').toString('utf-8');
  return JSON.parse(payload);
}

module.exports = { makeJWT, validateJWT, getPayload };