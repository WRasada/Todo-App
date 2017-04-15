const { ObjectID } = require('mongodb');

let middleware = {};

middleware.isValid = (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(404).send();
    }

    next();
}

module.exports = middleware;
