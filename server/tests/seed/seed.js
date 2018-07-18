const { ObjectID } = require('mongodb')
const { Todo } = require('../../models/todo')
const { User } = require('../../models/user')
const jwt = require('jsonwebtoken')

const userOneID = new ObjectID()
const userTwoID = new ObjectID()

const defaultUsers = [
  {
    _id: userOneID,
    email: 'userOne@mail.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userOneID, access: 'auth' }, 'secret').toString()
      }
    ]
  },
  {
    _id: userTwoID,
    email: 'userTwo@mail.com',
    password: 'userTwoPass'
  }
]

const defaultTodos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  }
]

const populateTodos = done => {
  Todo.remove()
    .then(() => Todo.insertMany(defaultTodos))
    .then(() => done())
}

const populateUsers = done => {
  User.remove().then(() => {
    const userOne = new User(defaultUsers[0]).save()
    const userTwo = new User(defaultUsers[1]).save()
    Promise.all([userOne, userTwo]).then(() => done())
  })
}

module.exports = {
  populateUsers,
  defaultUsers,
  populateTodos,
  defaultTodos
}
