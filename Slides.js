const { Schema, model } = require('mongoose');

const slidesSchema = new Schema({
	username: { type: String, required: true },
	slides: { type: Array }

}, { collection: 'slides' });

const Slides = model('Slides', slidesSchema);

module.exports = Slides;
