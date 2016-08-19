const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const employees = require('./be/employees.js')
const app = express();

var db;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('fe'));


MongoClient.connect('mongodb://localhost:27017/test', (err, database) => {
	if (err) return console.log(err);
	db = database;
	app.listen(3000, () => {
		console.log('listening on 3k');
	});
});

app.get('/', (req, res) => {
	res.sendFile(__dirname+ '/index.html');
});

app.post('/employees/add', employees.add);

app.get('/employees/get', employees.getAll);
app.get('/employees/update', employees.update);
