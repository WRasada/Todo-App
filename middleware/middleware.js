const { ObjectID } = require('mongodb');
const { User }     = require('./../models/user');

let middleware = {};

middleware.authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send(e);
  });
};

middleware.isValid = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(404).send();
    }
    next();
};

module.exports = middleware;
