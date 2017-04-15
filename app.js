require('./config/config');

const _               = require('lodash');
const express         = require('express');
const bodyParser      = require('body-parser');
const dateFormat      = require('dateformat');
const { ObjectID }    = require('mongodb');

const { mongoose }    = require('./config/db/mongoose');
const { Todo }        = require('./models/todo');

const app             = express();
const port            = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/************ Todo Routes ************/

// GET /todos - Show todos

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    if (!todos) {
      return res.status(404).send();
    }

    res.send({ todos });
  }, (e) => {
    res.status(400).send();
  });
});

// POST /todos - Create new todo

app.post('/todos', (req, res) => {
  let todo = new Todo({ text: req.body.text });

  todo.save().then((todo) => {
    res.send({todo});
  }, (e) => {
    res.status(400).send(e);
  })
});

// GET /todos/:id - Show a single todo

app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo })
  }).catch((e) => {
    res.status(400).send();
  });
});

// PATCH /todos/:id - Edit a single todo

// DELETE /todos/:id - Delete a single todo

// User Routes

// GET /users/profile - Show logged in user profile

// POST /users/login - Login user and authenticate

// POST /users/signup - Signup user and authenticate

// DELETE /users/logout - Logout current user and remove token


app.listen(port, () => {
  console.log(`Started server on port: ${port}`);
});

module.exports = { app };
