const mongoose = require('mongoose');

const BookInstanceSchema = mongoose.Schema({
	book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // reference to the associated book
	imprint: { type: String, required: true },
	status: {
		type: String,
		required: true,
		enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], // values that are only allowed, anything else will not work
		default: 'Maintenance'
	},
	due_back: { type: Date, default: Date.now() }
});

// Virtual for bookinstance's url:
BookInstanceSchema.virtual('url').get(() => {
	return '/catalog/bookinstance/' + this._id;
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
