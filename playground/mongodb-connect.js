const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost:27017'


MongoClient.connect(url, (err, client) => {
	if (err) return console.log(err);

	console.log('connected to db');
	const db = client.db('TodoApp');

	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, res) => {
	// 	if (err) return console.log('unable to insert todo');
	// 	console.log(JSON.stringify(res.ops, undefined, 2));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Antonio',
	// 	age: 21,
	// 	location: 'Anadia'
	// },(err,res) => {
	// 	if(err) return console.log('error');
	// 	console.log('inserted new document to collection users');
	// })

	client.close();

})