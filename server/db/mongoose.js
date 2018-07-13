const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(
  'mongodb://admin:admin123@ds035016.mlab.com:35016/todo-api',
  { useNewUrlParser: true }
)

module.exports = { mongoose }
