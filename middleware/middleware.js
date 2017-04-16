const { ObjectID } = require('mongodb');

let middleware = {};

middleware.authenticate = (req, res, next) => {
  let token = req.headers['x-auth'];

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

middleware.isValid = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(404).send();
    }
    next();
};

module.exports = middleware;
