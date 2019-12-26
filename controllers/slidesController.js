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

router.get('/:userName', function (req, res, next) {
	console.log('\x1b[33m%s\x1b[0m', 'getUserSlides called');

	mongoose
		.connect(url, options)
		.then(async () => {
			const { userName = null } = req.params;
			console.info(`userName is ${userName}`);
			const result = await Slides.findOne({ userName });
			if (result) {
				res.json(result.slides);
			} else res.status(404).send(`user ${userName} not found!`);
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
			const { userName = null } = req.body;
			const { slides = null } = req.body;
			const slidearr = slides.split(',');
			const validExtentionsResult = checkValidExtentions(slidearr);
			if (!validExtentionsResult) {
				return res.status(500).send(`Cannot upload slides, please use files extention: ${slidesExtentions}`);
			}
			const result = await Slides.findOne({ userName });
			if (result) {
				try {
					Slides.updateOne({ userName: userName }, { $push: { slides: { $each: slidearr } } }, function (err) {
						if (err) {
							return res.status(400).send('Error occured', err);
						} else {
							return res.status(200).send(`slides ${slidearr} uploaded successfully`);
						}
					});
				} catch (err) {
					console.error('some error occurred', err);
					res.send(500).send('***ERROR WHILE UPDATING:***', err.message);
				}
			} else {
				return res.status(404).send(`user ${userName} not found!`);
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
			const { userName = null } = req.body;
			const { slides = null } = req.body;
			const slidearr = slides.split(',');
			const validExtentionsResult = checkValidExtentions(slidearr);
			if (!validExtentionsResult) {
				return res.status(500).send(`Cannot remove slides,one or more files has wrong extension. please use files extentions: ${slidesExtentions}`);
			}
			console.log(`slidearr is ${slidearr} and type is ${typeof (slidearr)} len is ${slidearr.length}`);
			console.info(`userName is ${userName}`);
			const result = await Slides.findOne({ userName });
			if (result) {
				console.log('removing....', slidearr);
				try {
					const { nModified } = await Slides.updateOne({ userName: userName }, { $pull: { slides: { $in: slidearr } } });
					if (nModified > 0) {
						return res.status(200).send('slides removed successfully');
					} else {
						return res.status(400).send(`no slides found to remove! slides ${slidearr} cannot be found!`);
					}
				} catch (err) {
					console.error('some error occurred', err);
					res.send(500).send('***ERROR WHILE UPDATING:***', err.message);
				}
			} else {
				return res.status(404).send(`user ${userName} not found!`);
			}
		})
		.catch((err) => {
			console.error('some error occurred', err);
			res.status(500).send(err.message);
		});
});

router.get('/number/:userName', function (req, res, next) {
	console.log('\x1b[33m%s\x1b[0m', 'slides/number called');
	mongoose
		.connect(url, options)
		.then(async () => {
			const { userName = null } = req.params;
			const result = await Slides.findOne({ userName });
			if (result) {
				return res.status(200).send(result.slides.length);
			} else {
				return res.status(500).send('error');
			}
		});
});
// eslint-disable-next-line require-jsdoc
function checkValidExtentions(slidearr) {
	// eslint-disable-next-line guard-for-in
	for (let key in slidearr) {
		const extention = String(slidearr[key].split('.')[1]);
		if (!slidesExtentions.includes(extention)) {
			return false;
		}
	}
	return true;
}

module.exports = router;
