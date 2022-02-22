// get the author model:
const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator');

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
	res.render('author_form', { title: 'Create Author' });
};

// Handle Author create on POST.
exports.author_create_post = [
	body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.'),
	body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified'),
	body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
	body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),
	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
			return;
		} else {
			// form data is valid and now create a new author with the data provided:
			let author = new Author({
				first_name: req.body.first_name,
				family_name: req.body.family_name,
				date_of_birth: req.body.date_of_birth,
				date_of_death: req.body.date_of_death
			});

			// save to database:
			author.save(error => {
				if (error) return next(error);

				// Author added to the database and now redirect to that author's detail page:
				res.redirect(author.url);
			});
		}
	}
];

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
