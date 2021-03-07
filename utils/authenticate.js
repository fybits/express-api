const JWT = require('../jwt');

module.exports.authenticate = () => {
    return (req, res, next) => {
        if (!JWT.validateJWT(req.headers.authorization)) {
            res.status(401);
            res.send({ error: 'Sign in to get access to this resource' });
        } else {
            res.locals.user = JWT.getPayload(req.headers.authorization);
            next();
        }
    }
};