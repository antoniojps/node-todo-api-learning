const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

// USER
// schema
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: {
    type: [
      {
        access: {
          type: String,
          require: true
        },
        token: {
          type: String,
          require: true
        }
      }
    ]
  }
})

// Instance methods
UserSchema.methods = {
  // user.toObject changes the Mongoose document to a typical JavaScript object. They are both objects, but the Mongoose document is not extensible for example and has a bunch of functions attached to its prototype.
  toJSON() {
    const user = this
    const userObj = user.toObject()
    return _.pick(userObj, ['_id', 'email'])
  },

  generateAuthToken() {
    const user = this
    const access = 'auth'
    const token = jwt
      .sign(
        {
          _id: user._id.toHexString(),
          access
        },
        'secret'
      )
      .toString()
    user.tokens = user.tokens.concat([{ access, token }])

    return user.save().then(() => token)
  }
}

// Model methods
UserSchema.statics = {
  findByToken(token) {
    const User = this
    let decoded

    try {
      decoded = jwt.verify(token, 'secret')
    } catch (e) {
      return Promise.reject(e)
    }

    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    })
  }
}

// Middleware

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
      this.password = await encryptPassword(this.password)
      next()
  } else {
    next()
  }
})

async function encryptPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword
  } catch (e) {
    return e
  }
}

// model
const User = mongoose.model('User', UserSchema)

module.exports = { User }
