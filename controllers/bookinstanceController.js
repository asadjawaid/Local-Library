const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const async = require('async');

// Display list of all BookInstances.
exports.bookinstance_list = (req, res, next) => {
  BookInstance.find({})
    .populate('book')
    .exec((err, list_bookinstances) => {
      if (err) {
        return next(err);
      }

      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = (req, res) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((error, results) => {
      if (error) return next(error);

      res.render('bookinstance_detail', { title: `Copy ${results.book.title}`, bookinstance: results });
    });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = (req, res, next) => {
  // Find all the books and only get back the title
  Book.find({}, 'title').exec((error, results) => {
    if (error) return next(error); // pass to the error handler

    res.render('bookinstance_form', { title: 'Create Book instance', book_list: results });
  });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
  body('status').escape(),
  body('due_back', 'Invalid Date').optional({ checkFalsy: true }).isISO8601().toDate(),

  // Process request after validation and sanitization:
  (req, res, next) => {
    // extract the validation errors from the request:
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data:
    let bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    // check for any errors
    if (!errors.isEmpty()) {
      // There are erors. Render the form again with sanitized values and error messages:
      Book.find({}, 'title').exec((error, results) => {
        if (error) return next(error);

        res.render('bookinstance_form', {
          title: 'Create Book instance',
          book_list: results,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance: bookinstance,
        });
      });
    } else {
      // Data from form is valid:
      bookinstance.save(error => {
        if (error) return next(error);

        res.redirect(bookinstance.url);
      });
    }
  },
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};
