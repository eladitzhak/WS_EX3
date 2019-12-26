const { Schema, model } = require('mongoose');

const userSchema = new Schema({
	id: { type: Number, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String },
	userName: { type: String, required: true, unique: true },
	phone: { type: String },
	email: { type: String }

}, { collection: 'user' });

const User = model('User', userSchema);

module.exports = User;
