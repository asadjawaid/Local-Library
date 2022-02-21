// get the author model:
const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');

// Display list of all Authors.
exports.author_list = (req, res, next) => {
	Author.find()
		.sort([['family_name', 'ascending']])
		.exec((err, result) => {
			if (err) {
				return next(err);
			}

			res.render('author_list', { title: 'Authors', error: err, list_of_authors: result });
		});
};

// Display detail page for a specific Author.
exports.author_detail = (req, res) => {
	async.parallel(
		{
			author: callback => {
				Author.findById(req.params.id).exec(callback);
			},
			author_books: callback => {
				Book.find({ author: req.params.id }, 'title summary').exec(callback);
			}
		},
		(error, results) => {
			if (error) return next(error);

			if (results.author === null) {
				let error = new Error('Author not found');
				error.status = 404;
				return next(error);
			}

			res.render('author_detail', {
				title: 'Author Details',
				author: results.author,
				author_books: results.author_books
			});
		}
	);
};

// Display Author create form on GET.
exports.author_create_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.author_delete_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Author update POST');
};
