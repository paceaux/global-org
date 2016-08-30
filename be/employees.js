'strict mode';
const MongoClient = require('mongodb').MongoClient;
const employees = 'employees';

MongoClient.connect('mongodb://localhost:27017/test', (err, database) => {
	if (err) return console.log(err);
	exports.db = database;
});

exports.add = function (req, res) {
	exports.db.collection(employees).save(req.body, (err, result) => {
		if (err) return console.log(err);
		console.log('saved to database');
		res.redirect('/');
	});
};


exports.get = function (req, res) {
	if (req.query) {
		var results = exports.db.collection(employees).find(req.query).toArray((err, results) => {
			res.send(results)
		});
	} else {
		exports.db.collection(employees).find().toArray(function (err, results) {
			res.send(results);
		});
	}
};


exports.update = function (req, res) {
	if (req.query) {
		exports.db.collection(employees).updateOne({}, {}, function (err, result) {

		});
	}
};

exports.remove = function (req, res) {
	if (req.query) {
		exports.db.collection(employees).remove(req.query).then((results)=>{
			console.log(results);
			res.send(results);
		});
	} else {
		res.send("nothing removed");
	}
};



