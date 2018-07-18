const env = process.env.NODE_ENV || 'development'
if (env === 'production') {

  process.env.MONGODB_URI = 'mongodb://admin:admin123@ds035016.mlab.com:35016/todo-api'

} else if (env === 'development') {

  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'

} else if (env === 'test') {

  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'

}
