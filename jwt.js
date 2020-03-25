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
  let header = new Buffer(JSON.stringify(JWT.header)).toString('base64');
  let payload = new Buffer(JSON.stringify(JWT.payload)).toString('base64');
  
  let firstPart = `${header}.${payload}`;
  let signature = new Buffer(crypto.createHmac('sha256', process.env.SECRET)
                    .update(firstPart)
                    .digest('hex')).toString('base64');
  let JWTtoken = `${firstPart}.${signature}`;
  return JWTtoken
};

const validateJWT = (JWT) => {
  if (!JWT) return false;
  let chunks = JWT.split('.');
  let firstPart = `${chunks[0]}.${chunks[1]}`;
  let signature = new Buffer(crypto.createHmac('sha256', process.env.SECRET)
                    .update(firstPart)
                    .digest('hex')).toString('base64');
  return (chunks[2] === signature);
}

module.exports = { makeJWT, validateJWT };