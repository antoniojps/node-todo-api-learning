const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017'


MongoClient.connect(url, (err, client) => {
	if (err) return console.log(err);

	console.log('connected to db');
	const db = client.db('TodoApp');

	// db.collection('Todos').findOneAndUpdate(
	// 	{
	// 		_id: new ObjectID('5b25b7a5915232d24204695b')
	// 	},
	// 	{
	// 		$set:{completed:false}
	// 	},
	// 	{
	// 		returnOriginal: false
	// 	}
	// ).then(res => {
	// 	console.log(res)
	// })

	db.collection('Users').findOneAndUpdate(
		{
			name:'Antonio'
		},
		{
			$set: { name: 'Toze' },
			$inc: { age: 1 }
		},
		{
			returnOriginal: false
		}
	).then(res => {
		console.log(res)
	})

	client.close();

})