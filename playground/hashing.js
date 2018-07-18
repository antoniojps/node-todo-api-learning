const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const pw = 'password123'

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword
  } catch (e) {
    console.log(e)
  }
}

hashPassword(pw).then(hash => {
  bcrypt.compare('123', hash, (err, res) => {
    console.log(res)
  })
})


// const data = {
//   id: 10
// }

// const token = jwt.sign(data, '123abc')
// console.log(token)

// const decoded = jwt.verify(token, '123abc')
// console.log('decoded',decoded)

// const message = 'I am user number 3'
// const hash = SHA256(message).toString()

// //console.log(message, ' = ', hash)

// const data = {
//   id: 4
// }

// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// }
// const resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString()

// if (resultHash === token.hash) {
//   console.log('data was not changed')
// } else {
//   console.log('data was changed dont trust')
// }
