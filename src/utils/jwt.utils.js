const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');
const User = require('../models/superUserSchema');


exports.verifyToken = (token) => jwt.verify(token, jwtConfig.secret);

exports.createToken = (data) => jwt.sign(data, jwtConfig.secret);//, { expiresIn: jwtConfig.ttl }

exports.getUser = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ').length === 2 && req.headers.authorization.split(' ')[0] === 'Bearer' ) {
        jwt.verify(req.headers.authorization.split(' ')[1], jwtConfig.secret, function (err, decode) {
          if (err) req.user = undefined;
            User.findOne({
              id: decode.id
            }).then((d) => {
                req.user = d
                next()
            }).catch((e)=>{
                res.status(401)
                  .send({
                    message: 'Invalid credentials!'
                  });
            })
        });
      } else {
        throw new Error('Invalid credentials!')
        next();
      }
}