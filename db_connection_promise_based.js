const mongoose = require('mongoose');
const { DB_USER, DB_PASS, DB_HOST } = require('./constants');

const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}`;
const options = {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true

};

// promise
mongoose
	.connect(url, options)
	.then((db) => console.log('connected to: ', db.connection.name))
	.catch((err) => console.error('some error occurred', err));

const connection = mongoose.connection;
connection.on('error', (err) => console.error('connection error: ', err));
connection.once('open', () => console.log('connected to: ', connection.name));

module.exports = connection;
