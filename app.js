                           require('./config/config');

const _                  = require('lodash');
const express            = require('express');
const bodyParser         = require('body-parser');
const dateFormat         = require('dateformat');
const { ObjectID }       = require('mongodb');

const { mongoose }       = require('./config/db/mongoose');
const { User }           = require('./models/user');
const { Todo }           = require('./models/todo');
const { isValid,
        authenticate }   = require('./middleware/middleware');

const app                = express();
const port               = process.env.PORT;

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

app.get('/todos/:id', isValid,  (req, res) => {
  let id = req.params.id;

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

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']); // Properties to be updated

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = dateFormat('fullDate');
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({ _id: id }, { $set: body }, { new: true }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  }).catch((e) => {
    res.status(400).send();
  });
});

// DELETE /todos/:id - Delete a single todo

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  Todo.findOneAndRemove({ _id: id }).then((todo) => {
    res.send({ todo });
  }, (e) => {
    res.status(400).send();
  });
});

// User Routes

// POST /users - Signup user and authenticate

app.post('/users', (req, res) => {
  let user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send({ user });
  }).catch((e) => {
    res.status(400).send(e);
  })
})

// GET /users/profile - Show logged in user profile

app.get('/users/profile', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login - Login user and authenticate

// DELETE /users/logout - Logout current user and remove token


app.listen(port, () => {
  console.log(`Started server on port: ${port}`);
});

module.exports = { app };
