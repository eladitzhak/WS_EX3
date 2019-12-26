const express = require('express');
const userctrl = require('./controllers/userController.js');
const slidesCtrl = require('./controllers/slidesController.js');
require('./db_connection_promise_based');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/slides', slidesCtrl);
app.use('/user', userctrl);

app.use('/', (req, res) => {
	res.status(200);
	res.send('missing path');
});
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});
app.listen(port, () => console.log('Express ready on port:', port));
