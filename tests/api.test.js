const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../app');
const { Todo } = require('./../models/todo');
const { todos, populateTodos } = require('./seed/seed');

beforeEach(populateTodos);

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
