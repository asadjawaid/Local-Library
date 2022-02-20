const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
	title: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
	summary: { type: String, required: true },
	isbn: { type: String, required: true },
	genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }]
});

// Virtual for book's url:
BookSchema.virtual('url').get(() => {
	return '/catalog/book/' + this._id;
});

module.exports = mongoose.model('Book', BookSchema);
