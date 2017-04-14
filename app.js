require('./config/config');

const _               = require('lodash');
const express         = require('express');
const bodyParser      = require('body-parser');
const { ObjectID }    = require('mongodb');

const { mongoose }    = require('./config/db/mongoose');

const app             = express();
const port            = process.env.PORT;


app.listen(port, () => {
  console.log(`Started server on port: ${port}`);
});
