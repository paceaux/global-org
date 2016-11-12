const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const employees = require('./admin/employees.js');
const path = require('path');
const app = express();

var config = {
	directories: {
		admin: 'admin',
		site: 'public',
	},
	ports: {
		admin: 8080,
		site: 8080
	}
};


var db;

app.use(bodyParser());

app.use(bodyParser.urlencoded({extended: true}));

app.use('/admin',express.static(path.join(__dirname,config.directories.admin)));

app.use('/',express.static(path.join(__dirname,config.directories.site)));

MongoClient.connect('mongodb://localhost:27017/test', (err, database) => {
	if (err) return console.log(err);
	db = database;
	app.listen(config.ports.admin, () => {
		console.log('listening on:' + config.ports.admin);
	});
});



app.post('/employees/add', employees.add);

app.get('/employees/get/', employees.get);

app.put('/employees/update', employees.update);

app.delete('/employees/remove', employees.remove);


