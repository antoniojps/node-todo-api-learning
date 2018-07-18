const { ObjectID } = require('mongodb')
const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// Todo.remove (delete multiple methods, like Todo.find())

// Todo.remove({}).then(result => console.log(result))

// Todo.findOneAndRemove({ text: 'studying' }).then(res => {
//   console.log(res)
// })

Todo.findByIdAndRemove('5b487b3d10a1331b83c7467b').then(todo => {
  console.log('removed', todo)
})