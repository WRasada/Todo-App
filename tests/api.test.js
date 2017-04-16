const _                        = require('lodash');
const expect                   = require('expect');
const request                  = require('supertest');
const { ObjectID }             = require('mongodb');

const { app }                  = require('./../app');
const { User }                 = require('./../models/user');
const { Todo }                 = require('./../models/todo');
const { todos, populateTodos,
        users, populateUsers } = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('GET /todos', () => {
  it('should return all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  })
});

describe('POST /todos', () => {
  it('should create new todo', (done) => {
    let text = 'This is my new todo';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text }).then((todo) => {
          expect(todo.length).toBe(1);
          expect(todo[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  });
});

describe('GET /todos/:id', () => {
  it('should return a single todo', done => {
    let id = todos[0]._id.toHexString();

    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 for non object IDs', done => {
    request(app)
      .get('/todos/ThisIsNotAnObjectId')
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    let fakeId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${fakeId}`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo', (done) => {
    let id = todos[0]._id.toHexString();
    let text = 'New and improved';

    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('string');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    let id = todos[1]._id.toHexString();
    let text = 'New and Improved v2';

    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist;
      })
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    let id = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      })
  });
});

describe('POST /users', () => {
  it('should create a new user', (done) => {
    let user = { email: 'test@gmail.com', password: 'abc123'};
    request(app)
      .post('/users')
      .send(user)
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toExist();
        expect(res.body.user._id).toExist();
        expect(res.body.user.email).toBe(user.email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.find().then((users) => {
          expect(users.length).toBe(3);
          expect(users[2].email).toBe(user.email);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({ email: 'invalidemail.com', password: '123' })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toExist();
      })
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    let body = _.pick(users[0], ['email', 'password']);

    request(app)
      .post('/users')
      .send(body)
      .expect(400)
      .expect((res) => {
        expect(res.body.errmsg).toExist();
      })
      .end(done);
  });
});

describe('GET /users/profile', () => {
  it('should show profile if authenticated', (done) => {
    request(app)
      .get('/users/profile')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/profile')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login and return auth token', done => {
    let body = _.pick(users[0], ['email', 'password']);
    request(app)
      .post('/users/login')
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.header['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: '1234567' })
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});
