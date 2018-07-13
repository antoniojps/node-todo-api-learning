const { ObjectID } = require('mongodb')
const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')


const _id = '5b471bacc3c2fd1891d6b0bb'

// Todo.find({
//   _id
// }).then(todos => {
//   console.log('find',todos)
// })

// Todo.findOne({
//   _id
// }).then(todo => {
//   console.log('findOne',todo)
// })

// if (ObjectID.isValid(_id)) {
//   Todo.findById(_id)
//     .then(todo => {
//       if (!todo) return console.log('user not found')
//       console.log('findById', todo)
//     })
//     .catch(e => console.log(e.message))
// } else {
//   console.log('id not valid')
// }

if (ObjectID.isValid(_id)) {
  User.findById(_id)
    .then(user => {
      if (!user) return console.log('user not found')
      console.log('findById', user)
    })
    .catch(e => console.log(e.message))
} else {
  console.log('user id not valid')
}

