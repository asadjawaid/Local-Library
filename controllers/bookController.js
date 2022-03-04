const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const { body, validationResult } = require('express-validator');

// require async package
const async = require('async');
const book = require('../models/book');

exports.index = (req, res) => {
  async.parallel(
    {
      book_count: callback => {
        Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      book_instance_count: callback => {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count: callback => {
        BookInstance.countDocuments({ status: 'Available' }, callback);
      },
      author_count: callback => {
        Author.countDocuments({}, callback);
      },
      genre_count: callback => {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render('index', { title: 'Local Library Home', error: err, data: results });
    }
  );
};

// Display list of all books.
exports.book_list = (req, res, next) => {
  // Find all authors (get only title & the author), sort in ascending order, populate the author field, and execute
  Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec((err, list_books) => {
      // if there are any errors then pass the error to the error handler
      if (err) {
        return next(err);
      }

      // pass the content to the book_list.pug view
      res.render('book_list', { title: 'Book List', book_list: list_books });
    });
};

// Display detail page for a specific book.
exports.book_detail = (req, res, next) => {
  async.parallel(
    {
      book: callback => {
        Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
      },
      book_instance: callback => {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    (error, results) => {
      if (error) return next(error);

      // incase the book was not found: (book/123)
      if (results.book === null) {
        let error = new Error('Book not found');
        error.status = 404;
        return next(error);
      }

      // successful
      res.render('book_detail', {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance,
      });
    }
  );
};

// Display book create form on GET.
exports.book_create_get = (req, res) => {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel(
    {
      authors: callback => {
        Author.find(callback);
      },
      genres: callback => {
        Genre.find(callback);
      },
    },
    (error, results) => {
      if (error) return next(error);
      res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
    }
  );
};

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array:
  (req, res, next) => {
    // if the genre is not an array then we must converted it into one.
    if (!(req.body.genre instanceof Array)) {
      // if genre is empty or undefined
      if (typeof req.body.genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    // call the next middleware:
    next();
  },
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author must not be empty').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(), // for all selected genres use .* (genre is an array)
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data:
    let book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    // if there are any errors present
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      // Get all authors and genres for the form:
      async.parallel(
        {
          authors: callback => {
            Author.find(callback);
          },
          genres: callback => {
            Genre.find(callback);
          },
        },
        (error, results) => {
          if (error) return next(error);

          // Mark our selected genres as selected
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true';
            }
          }
          res.render('book_form', {
            title: 'Create Book',
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from the form is valid. Save book to the db.
      book.save(error => {
        if (error) return next(error);

        res.redirect(book.url); // redirect to new book detail page
      });
    }
  },
];

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = (req, res, next) => {
  async.parallel(
    {
      // find the book to update:
      book: callback => {
        Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
      },
      // Find the author (since we can update the author of the book)
      authors: callback => {
        Author.find(callback); // to let the user select a new author from the list of authors
      },
      genres: callback => {
        Genre.find(callback); // to let the user select a new genre from the list of genres
      },
    },
    (error, results) => {
      if (error) return next(error);

      // if the book does not exists:
      if (results.book === null) {
        let err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }

      // Success
      // Mark our selected genres as checked:
      for (let i = 0; i < results.genres.length; i++) {
        // iterate over the genres returned for that book
        for (let j = 0; i < results.book.genre.length; j++) {
          // if the current genre's id from the list of genres is equal to the genre's id from the list of genres for that book then set checked to true
          if (results.genres[i]._id.toString() === results.book.genre[j]._id.toString()) {
            results.genres[i].checked = 'true';
          }
        }
      }

      res.render('book_form', {
        title: 'Update Book',
        authors: results.authors,
        genres: results.genres,
        book: results.book,
      });
    }
  );
};

// Handle book update on POST.
exports.book_update_post = [
  // convert the genre to an array:
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }

    next();
  },

  // validate and sanitize fields:
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  // process the request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    // Create a book object with escaped/trimmed data and old id:
    let book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === 'undefinded' ? [] : req.body.genre,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages:

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: callback => {
            Author.find(callback);
          },
          genres: callback => {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) return next(err);

          // Mark our selected genres as checked:
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true';
            }
          }

          res.render('book_form', {
            title: 'Update Book',
            authors: results.authors,
            genres: results.genres,
            book: results.book,
            errors: errors.array(),
          });
        }
      );
    } else {
      // Data from form is valid. Update the record
      Book.findByIdAndUpdate(req.params.id, book, {}, (err, theBook) => {
        if (err) return next(err);

        // Successful - redirect to book detail page:
        res.redirect(theBook.url);
      });
    }
  },
];
