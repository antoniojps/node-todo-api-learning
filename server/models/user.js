const mongoose = require('mongoose')

// USER
// schema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
      validator: v =>
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(
          v
        ),
      message: '{VALUE} is not a valid email'
    }
  }
})

// model
const User = mongoose.model('User', userSchema)

module.exports = { User }
