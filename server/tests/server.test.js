const { ObjectID } = require('mongodb')
const expect = require('expect')
const request = require('supertest')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')
const {
  populateTodos,
  defaultTodos,
  populateUsers,
  defaultUsers
} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

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

describe('DELETE /todos/:id', () => {
  it('should remove a todo', done => {
    const hexID = defaultTodos[1]._id.toHexString()

    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexID)
      })
      .end((err, res) => {
        if (err) return done(err)
        Todo.findById(hexID)
          .then(todo => {
            expect(todo).toBeFalsy()
            done()
          })
          .catch(e => done(e))
      })
  })

  it('should return a 404 if todo not found', done => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done)
  })

  it('should return a 400 if object id is invalid', done => {
    request(app)
      .delete('/todos/123')
      .expect(400)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    const hexID = defaultTodos[0]._id.toHexString()
    const body = {
      text: 'surfing',
      completed: true
    }

    request(app)
      .patch(`/todos/${hexID}`)
      .send(body)
      .expect(200)
      .expect(res => {
        const {
          body: { todo }
        } = res
        expect(todo._id).toBe(hexID)
        expect(todo.completed).toBe(body.completed)
        expect(todo.text).toBe(body.text)
        expect(typeof todo.completedAt).toBe('number')
      })
      .end((err, res) => {
        if (err) return done(err)
        Todo.findById(hexID)
          .then(todo => {
            expect(todo.text).toBe('surfing')
            expect(todo.completed).toBe(true)
            expect(typeof todo.completedAt).toBe('number')
            done()
          })
          .catch(e => done(e))
      })
  })

  it('should clear completedAt when todo is not completed', done => {
    const hexID = defaultTodos[1]._id.toHexString()
    const body = {
      completed: false,
      text: 'Second test todo new text'
    }

    request(app)
      .patch(`/todos/${hexID}`)
      .send(body)
      .expect(200)
      .expect(res => {
        const {
          body: { todo }
        } = res
        expect(todo._id).toBe(hexID)
        expect(todo.completed).toBe(body.completed)
        expect(todo.text).toBe(body.text)
      })
      .end((err, todo) => {
        if (err) return done(err)
        Todo.findById(hexID)
          .then(todo => {
            expect(todo.text).toBe(body.text)
            expect(todo.completed).toBe(body.completed)
            expect(todo.completedAt).toBeNull()
            done()
          })
          .catch(e => done(e))
      })
  })
})

// Users

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', defaultUsers[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(defaultUsers[0]._id.toHexString())
        expect(res.body.email).toBe(defaultUsers[0].email)
      })
      .end(done)
  })

  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /user', () => {
  it('should create a user', done => {
    const email = 'email@example.com'
    const password = 'uniquePasword123'

    request(app)
      .post('/user')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy()
        expect(res.body._id).toBeTruthy()
        expect(res.body.email).toBe(email)
      })
      .end(err => {
        if (err) return done(err)

        User.findOne({ email }).then(user => {
          expect(user).toBeTruthy()
          expect(user.password).not.toBe(password)
          done()
        })
      })
  })

  it('should return validation errors if request invalid', done => {
    const email = 'bademail'
    const password = '123'

    request(app)
      .post('/user')
      .send({ email, password })
      .expect(400)
      .end(done)
  })

  it('should not create user if email in use', done => {
    const password = 'randompassword123'

    request(app)
      .post('/user')
      .send({ email: defaultUsers[0].email, password })
      .expect(400)
      .end(done)
  })
})
