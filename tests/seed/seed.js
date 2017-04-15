const { ObjectID } = require('mongodb');

const { Todo } = require('./../../models/todo');

const todos = [
  {
    _id: new ObjectID(),
    text: 'this is my first todo',
  }, {
    _id: new ObjectID(),
    text: 'this is my second todo',
    completed: true
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

module.exports = {
  todos,
  populateTodos
};
