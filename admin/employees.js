'strict mode';
const MongoClient = require('mongodb').MongoClient;
const employees = 'employees';
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;


MongoClient.connect('mongodb://localhost:27017/test', (err, database) => {
	if (err) return console.log(err);
	exports.db = database;
});

var addSingle = function (data, response) {

	exports.db.collection(employees).find({"first-name": data["first-name"], "last-name":data["last-name"], "country": data["country"],"office":data["office"]}).toArray( (error, results)=> {
		if(error) throw error;

		if (results.length > 0) {
			response.send({status: 'duplicate',result: results});
		} else {
			exports.db.collection(employees).save(data, (err, result) => {
				if (err) return err;
				response.json({status: 'success',result: result});
			});
		}
	});
}

exports.add = function (req, response) {

	if (req.is('json') || req.is('application/json')) {

		if (Array.isArray(req.body)) {
			req.body.forEach(function (employee) {
				addSingle(employee, response);
			})
		} else {
			addSingle(req.body, response);
		}
	}
};


exports.get = function (req, res) {

	if (req.query) {

		var results = exports.db.collection(employees).find(req.query).toArray((err, results) => {
			res.send(results);
		});

	} else {
		exports.db.collection(employees).find().toArray(function (err, results) {
			res.send(results);
		});
	}
};


exports.update = function (req, res) {

	if (req.is('json') || req.is('application/json')) {
		exports.db.collection(employees).find(req.body).toArray( (error, results) => {

			if (results) {
				exports.db.collection(employees).updateOne({_id: req.body["_id"]}, req.body, function (err, result) {
					if (err) res.send({status: 'error', result: err})
					res.send(result);
				});
			} else {
				res.send({status: 'missing'})
			}
		});
	}
};

exports.remove = function (req, res) {

	if (req.is('json') || req.is('application/json')) {
		exports.db.collection(employees).find(req.body).toArray( (error, results) => {
			if (results) {
				exports.db.collection(employees).remove({"_id": ObjectId(req.body._id)}, (err, result) => {
					if (err) res.send({status: 'error', results: err});
					res.send({status: 'success', result: result});
				})
			} else {
				res.send({status: 'missing'});
			}
		});
	}
};



