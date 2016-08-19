const MongoClient = require('mongodb').MongoClient;
const employees = 'employees';

MongoClient.connect('mongodb://localhost:27017/test', (err, database) => {
	if (err) return console.log(err);
	exports.db = database;
});

exports.add = function (req, res) {
	console.log("you did it");
	console.log(req.body);
	exports.db.collection(employees).save(req.body, (err, result) => {
		if (err) return console.log(err);
		console.log('saved to database');
		res.redirect('/');
	});
};

exports.getAll = function (req, res) {
	exports.db.collection(employees).find().toArray(function (err, results) {
		res.send(results);
	});
};

exports.update = function (req, res) {
	var col = exports.db.collection(employees);
	col.updateOne({}, {}, function (err, result) {

	});
};

