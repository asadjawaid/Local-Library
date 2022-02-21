const express = require('express');
const router = express.Router();

// require controller modules:
const BookController = require('../controllers/bookController');
const AuthorController = require('../controllers/authorController');
const BookInstanceController = require('../controllers/bookinstanceController');
const GenreController = require('../controllers/genreController');

// ==================================
// Book Routes:
// ==================================
// GET catalog home page.
router.get('/', BookController.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', BookController.book_create_get);

// POST request for creating Book.
router.post('/book/create', BookController.book_create_post);

// GET request to delete Book.
router.get('/book/:id/delete', BookController.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', BookController.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', BookController.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', BookController.book_update_post);

// GET request for one Book.
router.get('/book/:id', BookController.book_detail);

// GET request for list of all Book items.
router.get('/books', BookController.book_list);

// ==================================
// Author Routes:
// ==================================
// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', AuthorController.author_create_get);

// POST request for creating Author.
router.post('/author/create', AuthorController.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', AuthorController.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', AuthorController.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', AuthorController.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', AuthorController.author_update_post);

// GET request for one Author.
router.get('/author/:id', AuthorController.author_detail);

// GET request for list of all Authors.
router.get('/authors', AuthorController.author_list);

// ==================================
// Genre Routes:
// ==================================
// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', GenreController.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', GenreController.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', GenreController.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', GenreController.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', GenreController.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', GenreController.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', GenreController.genre_detail);

// GET request for list of all Genre.
router.get('/genres', GenreController.genre_list);

// ==================================
// Book Instance Routes:
// ==================================
// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', BookInstanceController.bookinstance_create_get);

// POST request for creating BookInstance.
router.post('/bookinstance/create', BookInstanceController.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', BookInstanceController.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', BookInstanceController.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', BookInstanceController.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', BookInstanceController.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstance/:id', BookInstanceController.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', BookInstanceController.bookinstance_list);

module.exports = router;
