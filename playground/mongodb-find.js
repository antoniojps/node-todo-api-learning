const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017'


MongoClient.connect(url, (err, client) => {
	if (err) return console.log(err);

	console.log('connected to db');
	const db = client.db('TodoApp');

	// db.collection('Todos').find({
	// 	_id: new ObjectID('5b25aad2129f9530b9bd7a1b')
	// }).toArray().then((docs) => {
	// 	console.log(JSON.stringify(docs,undefined,2));
	// },(err) => {
	// 	console.log('error');
	// })

	db.collection('Users').find({name:'Antonio'})
		.toArray().then((res) => {
			console.log(JSON.stringify(res,undefined,2));
		}, (err) => {
			console.log('error');
		})

	client.close();

})