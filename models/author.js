const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
	first_name: { type: String, required: true, maxLength: 100 },
	family_name: { type: String, required: true, maxLength: 100 },
	date_of_birth: { type: Date },
	date_of_death: { type: Date }
});

// Virtual for author schema: (recall for mongoose virtuals do not use arrow functions)
AuthorSchema.virtual('name').get(function () {
	return this.first_name + ' ' + this.family_name;
});

// Virtual for author's lifespan:
AuthorSchema.virtual('lifespan').get(function () {
	let lifetime_string = '';
	if (this.date_of_birth) {
		lifetime_string = this.date_of_birth.getYear().toString();
	}
	lifetime_string += ' - ';
	if (this.date_of_death) {
		lifetime_string += this.date_of_death.getYear();
	}
	return lifetime_string;
});

// Virtual for url:
AuthorSchema.virtual('url').get(function () {
	return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);
