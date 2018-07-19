require('./config/config')
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')

const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose')
const { User } = require('./models/user')
const { Todo } = require('./models/todo')
const { authenticate } = require('./middleware/authenticate')

const app = express()
const port = process.env.PORT
app.use(bodyParser.json())

// GET

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id })
    .then(todos => {
      res.status(200).send({
        todos
      })
    })
    .catch(e => {
      res.status(400).send(e)
    })
})

// /todos/:id
app.get('/todos/:id', authenticate, (req, res) => {
  const {
    params: { id }
  } = req

  if (!ObjectID.isValid(id)) return res.status(400).send('invalid ID')

  Todo.findOne({ _id: id, _creator: req.user._id })
    .then(todo => {
      if (!todo) return res.status(404).send()
      res.send({
        todo
      })
    })
    .catch(e => {
      res.status(400).send()
    })
})

// POST

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  todo.save().then(
    doc => {
      res.status(200).send({
        todo: doc
      })
    },
    e => {
      res.status(400).send(e)
    }
  )
})

// DELETE
app.delete('/todos/:id', authenticate, (req, res) => {
  const {
    params: { id }
  } = req

  if (!ObjectID.isValid(id)) return res.status(400).send()

  Todo.findOneAndRemove({ _id: id, _creator: req.user._id })
    .then(todo => {
      if (!todo) return res.status(404).send()
      res.send({
        todo
      })
    })
    .catch(e => res.status(400).send())
})

// PATCH
app.patch('/todos/:id', authenticate, (req, res) => {
  const {
    params: { id }
  } = req
  const body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) return res.status(400).send()

  if (_.isBoolean(body.completed) & body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user._id
    },
    {
      $set: body
    },
    {
      new: true
    }
  )
    .then(todo => {
      if (!todo) res.status(404).send()

      res.send({
        todo
      })
    })
    .catch(e => res.status(400).send())
})

app.post('/user', (req, res) => {
  const body = _.pick(req.body, ['email', 'password'])
  const user = new User(body)

  user
    .save()
    .then(() => user.generateAuthToken())
    .then(token => {
      res.header('x-auth', token).send(user)
    })
    .catch(e => res.status(400).send(e))
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

// POST /users/login {email,password}

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password'])
  const { email, password } = body

  User.findByCredentials(email, password)
    .then(async user => {
      const token = await user.generateAuthToken()
      res.header('x-auth', token).send(user)
    })
    .catch(e => {
      res.status(400).send(e.message)
    })
})

// DELETE /users/me/token

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user
    .removeToken(req.token)
    .then(() => {
      res.status(200).send()
    })
    .catch(e => {
      res.status(400).send()
    })
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = { app }
