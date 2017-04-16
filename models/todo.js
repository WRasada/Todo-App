const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TodoSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: String,
    default: null
  },
  _creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = { Todo };
