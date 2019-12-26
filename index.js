const express = require('express');
const logger = require('morgan');
// const ctrl = require('./controller');
const router = express.Router();
const Color = require('color');
const color = Color('rgb(219,68,55)');
const mongoose = require('mongoose');
const User = require('./User');
const userctrl = require('./controllers/userController.js');
const slidesCtrl = require('./controllers/slidesController.js');
require('./db_connection_promise_based');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //capability to get bodyparam url encoded --> x-www url encoder in postman
app.use(logger('dev'));

// const {
// 	userController,
// 	userSlidesController
// }

// app.use('/usersSlides', restaurantRouter);
// app.use('/user', userRouter);

app.use('/slides', slidesCtrl);
app.use('/user', userctrl);

// app.use('/slides', slidesCtrl);
// app.get('/users', ctrl.getAllPosts);
app.get('/', (req, res) => {
	res.status(200);
	res.send('missing path');
});
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});
app.listen(port, () => console.log('Express ready on port:', port));
