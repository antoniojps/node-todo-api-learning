const {
  MongoClient,
  ObjectID
} = require('mongodb')
const url = 'mongodb://localhost:27017'

MongoClient.connect(
  url,
  (err, client) => {
    if (err) return console.log(err)

    console.log('connected to db')
    const db = client.db('TodoApp')

    // deleteMany
    // db.collection('Todos').deleteMany({text:'Estudar'}).then((res) => {
    // 	console.log(res);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text:'Estudar'}).then((res) => {
    // 	console.log(res);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({ completed: false }).then(res => {
    // 	console.log(res)
    // })

    db.collection('Users')
      .deleteMany({ name: 'Antonio' })
      .then(res => {
        console.log(res)
      })

    db.collection('Users')
      .findOneAndDelete({
        _id: new ObjectID(
          '5b25b694915232d242046910'
        )
      })
      .then(res => {
        console.log(res)
      })

    client.close()
  }
)
