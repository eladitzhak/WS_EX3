const mongoose = require('mongoose');
const User = require('../User');
const express = require('express');
const router = express.Router();
const consts = require('../constants');
const connection = require('../db_connection_promise_based');

const { DB_HOST, DB_USER, DB_PASS } = consts;
const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}`;
const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	user: DB_USER,
	pass: DB_PASS

};

router.use(function (req, res, next) {
	console.info('Someone entered to usercontroller in time: ', Date.now());
	next();
});

router.get('/getAllUsers', function (req, res, next) {
	console.log('\x1b[33m%s\x1b[0m', 'getAllUsers called');
	User.find({}, (err, result) => {
		if (err) {
			console.error('*****error!******', err);
		}
		console.log('userData');
		console.log('\x1b[33m%s\x1b[0m', 'user in controller'); // yello
		console.log(result);
		res.json(result);
	});
});
// router.get('/:id', function (req, res, next) {
// 	mongoose
// 		.connect(url, options)
// 		.then(async () => {
// 			// Query goes here
// 			const { id = null } = req.params;
// 			console.log(`req parmsa: ${req.params.id}`);
// 			console.info(`id is ${id}`);
// 			const result = await User.findOne({ id });

// 			if (result) res.json(result);
// 			else res.status(404).send(`user ${id} not found!`);
// 		})
// 		.catch(err => {
// 			console.error('some error occurred', err);
// 			res.status(500).send(err.message);
// 		});
// });
router.get('/:username', function (req, res, next) {
	mongoose
		.connect(url, options)
		.then(async () => {
			// Query goes here
			const { username = null } = req.params;
			console.info(`username is ${username}`);
			const result = await User.findOne({ username });

			if (result) res.json(result);
			else res.status(404).send(`user ${username} not found!`);
		})
		.catch(err => {
			console.error('some error occurred', err);
			res.status(500).send(err.message);
		});
});

router.post('/addUser', function (req, res, next) {
	console.log('adduser called!');
	mongoose
		.connect(url, options)
		.then(async () => {
			const {
				id = null,
				firstName = null,
				lastName = null,
				username = null,
				phone = null,
				email = null
			} = req.body;
			const newUser = new User({ id, firstName, lastName, username, phone, email });
			console.log(newUser);
			const resultusernameExists = await User.findOne({ username });
			if (resultusernameExists) {
				const msg = `username ${username} already exist!`;
				res.status(500).send(msg);
			}
			const result = await newUser.save();
			if (result) res.status(200).send(`new user created succefully ${username}`);
			else res.status(500).send('error in save:' + result);
		})
		.catch(err => {
			console.error('some error occurred', err);
			res.status(500).send(err.message);
		});
});

router.put('/editUser', function (req, res) {
	console.log('editUser called!');
	mongoose.connect(url, options)
		.then(async () => {
			const { username = null } = req.body;
			const result = await User.findOne({ username });
			if (!result) {
				return res.status(404).send('user not found!');
			}
			const { firstName, lastName, phone, email } = result;
			const receivedParams = req.body;
			User.updateOne({ username }, { firstName, lastName, phone, email, ...receivedParams }, (err, result) => {
				if (err) {
					res.status(500).send('error in update:' + err);
				}
				res.status(200).send(`user updated succefully ${username}`);
			});
		}).catch((err) => {
			console.error('error occured!', err);
			return res.status(500).send('error occured:' + err);
		});
});

router.delete('/removeUser', function (req, res, next) {
	console.log('removeuser called!');
	mongoose
		.connect(url, options)
		.then(async () => {
			const usernameProvided = req.body.username;
			console.log('username proveded', usernameProvided);
			if (!usernameProvided || !(typeof usernameProvided === 'string')) {
				res.status(500).end('missing correct username value!');
			} else {
				const result = await User.findOne({ username: usernameProvided });
				console.error(result);
				if (result) {
					console.log('found user!');
					const removeResult = await User.deleteOne({ username: usernameProvided });
					console.log(removeResult);
					if (removeResult) {
						res.status(200).send(`user ${usernameProvided} removed succeffuly!`);
					} else {
						res.status(400).send('cannot remove user! not removed any user!');
					}
				} else {
					res.status(404).send('cannot find user! not removed any user!');
				}
			}
		})
		.catch(err => {
			console.error('some error occurred', err);
			res.status(500).send(err.message);
		});
});

module.exports = router;