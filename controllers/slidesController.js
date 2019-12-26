const mongoose = require('mongoose');
const Slides = require('../Slides');
const express = require('express');
const router = express.Router();
const consts = require('../constants');
const Userctrl = require('./userController');
const User = require('../User');
const slidesExtentions = ['ppt', 'pptx'];
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
	console.info('Someone entered to slidescontroolr in time: ', Date.now());
	console.log(req.params);
	next();
});

router.get('/:username', function (req, res, next) {
	console.log('\x1b[33m%s\x1b[0m', 'getUserSlides called');

	mongoose
		.connect(url, options)
		.then(async () => {
			const { username = null } = req.params;
			console.info(`username is ${username}`);
			const result = await Slides.findOne({ username });
			if (result) {
				res.json(result.slides);
			} else res.status(404).send(`user ${username} not found!`);
		})
		.catch((err) => {
			console.error('some error occurred', err);
			res.status(500).send(err.message);
		});
});
router.post('/addSlides', function (req, res, next) {
	console.log('\x1b[33m%s\x1b[0m', 'addSlides called');
	mongoose
		.connect(url, options)
		.then(async () => {
			const { username = null } = req.body;
			const { slides = null } = req.body;
			const slidearr = slides.split(',');
			const validExtentionsResult = checkValidExtentions(slidearr);
			if (!validExtentionsResult) {
				return res.status(500).send(`Cannot upload slides, please use files extention: ${slidesExtentions}`);
			}
			console.log(`slidearr is ${slidearr} and type is ${typeof (slidearr)} len is ${slidearr.length}`);
			console.info(`username is ${username}`);
			console.info(`slides is ${slides}`);
			console.info(`typeof slides ${typeof (slides)}`);
			const result = await Slides.findOne({ username });
			const slidesQty = slidearr.length;
			console.log(slidesQty);
			if (result) {
				console.log('updating....');
				try {
					// const updateResult = Slides.updateOne({ username: username }, { $push: { slides: { $each: ["ssss","ssssssssss"] } } });
					//  db.slides.updateOne({username:"eladit"},{$push:{slides: {$each: slides}}})
					// res.sendStatus(200).send(updateResult);
					// User.updateOne({ username: username }, { $inc: { slidesQty: slidesQty } }).then(console.log("updated user slides QTY:",slidesQty));
					Slides.updateOne({ username: username }, { $push: { slides: { $each: slidearr } } }, function (err) {
						if (err) {
							return res.status(400).send('Error occured', err);
						} else {
							console.log('Successfully added');
							console.log('updating user slides quantity');
							const updateQtyResult = User.updateOne({ username: username }, { $inc: { slidesQty: slidesQty } }).then(console.log('updated user slides QTY', slidesQty));
							if (updateQtyResult) {
								return res.status(200).send(`slides ${slidearr} uploaded successfully`);
							} else {
								return res.status(400).send('Error occured cannot update user slides Quantity');
							}
						}
					});
				} catch (err) {
					console.error('some error occurred', err);
					res.send(500).send('***ERROR WHILE UPDATING:***', err.message);
				}
			} else {
				return res.status(404).send(`user ${username} not found!`);
			}
		})
		.catch((err) => {
			console.error('some error occurred', err);
			res.status(500).send(err.message);
		});
});

router.put('/removeSlides', function (req, res, next) {
	console.log('\x1b[33m%s\x1b[0m', 'removeSlides called');
	mongoose
		.connect(url, options)
		.then(async () => {
			const { username = null } = req.body;
			const { slides = null } = req.body;
			const slidearr = slides.split(',');
			const validExtentionsResult = checkValidExtentions(slidearr);
			if (!validExtentionsResult) {
				return res.status(500).send(`Cannot remove slides,one or more files has wrong extension. please use files extentions: ${slidesExtentions}`);
			}
			console.log(`slidearr is ${slidearr} and type is ${typeof (slidearr)} len is ${slidearr.length}`);
			console.info(`username is ${username}`);
			const result = await Slides.findOne({ username });
			if (result) {
				console.log('removing....');
				try {
					const { nModified } = await Slides.updateOne({ username: username }, { $pull: { slides: { $in: slidearr } } });
					console.log(` Modified: ${nModified}  `);
					if (nModified > 0) {
					// db.slides.update(    { username: "good_guy" },    { $pull: { slides: "4.pptx" } } ) 
						console.log('Successfully removed ', nModified);
						console.log('updating user slides quantity');
						const updateQtyResult = await User.updateOne({ username: username }, { $inc: { slidesQty: -nModified } }).then(console.log('updated reduced user slides QTY', -slidesQty));
						if (updateQtyResult) {
							return res.status(200).send(`found ${nModified} slides and removed successfully`);
						} else {
							return res.status(400).send('Error occured cannot update user slides Quantity');
						}
					} else {
						return res.status(400).send(`no slides found to remove! slides ${slidearr} cannot be found!`);
					}
				} catch (err) {
					console.error('some error occurred', err);
					res.send(500).send('***ERROR WHILE UPDATING:***', err.message);
				}
			} else {
				return res.status(404).send(`user ${username} not found!`);
			}
		})
		.catch((err) => {
			console.error('some error occurred', err);
			res.status(500).send(err.message);
		});
});

router.get('/number/:username', function (req, res, next) {
	console.log('\x1b[33m%s\x1b[0m', 'slides/number called');
	mongoose
		.connect(url, options)
		.then(async () => {
			const { username = null } = req.params;
			const result = await Slides.findOne({ username });
			if (result) {
				return res.status(200).send(result.slides.length);
			} else {
				return res.status(500).send('error');
			}
		});
});
// eslint-disable-next-line require-jsdoc
function checkValidExtentions (slidearr) {
	// eslint-disable-next-line guard-for-in
	for (let key in slidearr) {
		const extention = String(slidearr[key].split('.')[1]);
		console.log(`extention is: ${extention}`);
		if (!slidesExtentions.includes(extention)) {
			return false;
		}
	}
	return true;
}

module.exports = router;
