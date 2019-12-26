/* eslint-disable arrow-parens */
const mongoose = require('mongoose');
const User = require('./User');
const consts = require('./constants');
const { DB_HOST, DB_USER, DB_PASS } = consts;
const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}`;
const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	user: DB_USER,
	pass: DB_PASS

};




//get req.parms ? then sent to specific contorller
console.log('got to contoroller')

module.exports = {
	getAllPosts (req, res, next) {
		mongoose
			.connect(url, options)
			.then(async () => {
				// Query goes here
				const result = await User.find({});

				if (result) res.json(result);
				else res.status(404).send('not found');
			})
			.catch(err => {
				console.error('some error occurred', err);
				res.status(500).send(err.message);
			});
	} 
	
		

	
};


// module.exports = {
// 	// getAllPosts (req, res, next) {
// 	// 	console.log('1');
// 	// 	User.find({}, (err, result) => {
// 	// 		if (err) {
// 	// 			console.log('*****error!******', err);
// 	// 		}
// 	// 		console.log('userData');
// 	// 		console.log('\x1b[33m%s\x1b[0m', 'user in controller');  //yello
// 	// 		console.log(result);
// 	// 		res.json(result);
// 	// 	});
// 	// },
// 	getPost (req, res, next) {

// 	},
// 	editPost (req, res, next) {

// 	},
// 	addPost (req, res, next) {

// 	},
// 	removePost (req, res, next) {

// 	}
// };
