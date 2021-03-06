const mongoose = require('mongoose');
const { DateTime } = require('luxon');

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
BookInstanceSchema.virtual('url').get(function () {
	return '/catalog/bookinstance/' + this._id;
});

BookInstanceSchema.virtual('due_back_formatted').get(function () {
	return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
