const mongoose    = require('mongoose');
const validator   = require('validator');
const jwt         = require('jsonwebtoken');
const bcrypt      = require('bcrypstjs');
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
      validator: validaotr.isEmail,
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
