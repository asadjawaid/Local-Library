const mongoose = require('mongoose');

const GenreSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 3,
		maxLength: 100
	}
});

// Virtual for url:
GenreSchema.virtual('url').get(() => {
	return '/catalog/genre/' + this._id;
});

module.exports = mongoose.model('Genre', GenreSchema);
