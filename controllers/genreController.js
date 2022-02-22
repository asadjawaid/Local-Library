const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator');

// Display list of all Genre.
exports.genre_list = (req, res, next) => {
	Genre.find({})
		.sort([['name, ascending']])
		.exec((err, data) => {
			if (err) {
				return next(err);
			}

			res.render('genre_list', { title: 'Genre List', list_of_genres: data });
		});
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
	async.parallel(
		{
			genre: callback => {
				Genre.findById(req.params.id).exec(callback);
			},
			genre_books: callback => {
				Book.find({ genre: req.params.id }).exec(callback);
			}
		},
		(error, results) => {
			if (error) {
				return next(error);
			}

			// incase we got no genres back: (e.g genre/32 dne)
			if (results.genre === null) {
				let error = new Error('Genre not found');
				error.status = 404;
				return next(error);
			}

			// no errors:
			res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books });
		}
	);
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res) => {
	res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
	body('name', 'Genre name required!').trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		// extract the validation errors from a request:
		const errors = validationResult(req);

		// Create a new genre object with escaped and trimmed data.
		let genre = new Genre({
			name: req.body.name
		});

		// If there are any errors with the data, then redisplay the form with the errors.
		if (!errors.isEmpty()) {
			res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
			return;
		} else {
			// Date from form is valid
			// Check if Genre with the same name already exists:
			Genre.findOne({ name: req.body.name }).exec((error, found_genre) => {
				if (error) return next(error);

				// Genre already exists
				if (found_genre) {
					// Genre exists, redirect to its detail page:
					res.redirect(found_genre.url);
				}
				// Genre does not exists in the database
				else {
					genre.save(error => {
						if (error) return next(error);

						// Genre saved. Redirect to genre detail page:
						res.redirect(genre.url);
					});
				}
			});
		}
	}
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Genre update POST');
};
