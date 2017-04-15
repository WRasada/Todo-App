const { ObjectID } = require('mongodb');
const jwt          = require('jsonwebtoken')

const { User }     = require('./../../models/user');
const { Todo }     = require('./../../models/todo');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

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

const users = [
  {
    _id: userOneId,
    email: 'wes@gmail.com',
    password: 'atestpassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET)
    }]
  },
  {
    _id: userTwoId,
    email: 'westwo@gmail.com',
    password: 'anotherpassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET)
    }]
  }
]
const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
