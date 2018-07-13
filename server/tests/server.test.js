const { ObjectID } = require('mongodb')
const expect = require('expect')
const request = require('supertest')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')

// Runs before the tests, makes database predictable and stable
const defaultTodos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo'
  }
]

beforeEach(done => {
  Todo.remove()
    .then(() => Todo.insertMany(defaultTodos))
    .then(() => done())
})

describe('POST /todos', () => {
  it('should create a new todo', done => {
    const text = 'test todo test'

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text)
      })
      .end((err, res) => {
        if (err) return done(err)

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1)
            expect(todos[0].text).toBe(text)
            done()
          })
          .catch(e => done(e))
      })
  })

  it('should not create todo with invalid body data', done => {
    const body = null

    request(app)
      .post('/todos')
      .send(body)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(defaultTodos.length)
            done()
          })
          .catch(e => done(e))
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(defaultTodos.length)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${defaultTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(defaultTodos[0].text)
      })
      .end(done)
  })

  it('should return 400 if todo id is invalid', done => {
    request(app)
      .get(`/todos/123`)
      .expect(400)
      .end(done)
  })

  it('should return 404 if todo not found', done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done)
  })
})
