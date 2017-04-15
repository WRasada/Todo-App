const mongoose    = require('mongoose');
const validator   = require('validator');
const jwt         = require('jsonwebtoken');
const bcrypt      = require('bcryptjs');
const _           = require('lodash');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    minlength: 1,
    required: true,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    }
  }]
})

const User = mongoose.model('User', UserSchema);

module.exports = { User };
