const express = require('express')
const bodyParser = require('body-parser')

const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose')
const { User } = require('./models/user')
const { Todo } = require('./models/todo')

const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())

// GET

app.get('/todos', (req, res) => {
  Todo.find()
    .then(todos => {
      res.status(200).send({
        todos
      })
    })
    .catch(e => {
      res.status(400).send(e)
    })
  //res.send(Todo.find())
})

// /todos/:id
app.get('/todos/:id', (req, res) => {
  const {
    params: { id }
  } = req

  if (!ObjectID.isValid(id)) return res.status(400).send("invalid ID")

  Todo.findById(id)
    .then(todo => {
      if(!todo) return res.status(404).send()
      res.send({
        todo
      })
    })
    .catch(e => {
      res.status(400).send()
    })
})

// POST

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
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

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = { app }
