const express= require('express')
const router= express.Router()
const booksController= require('../controllers/books.controllers')


// Create route
router.post('/books', booksController.createBook)
//read route
router.get('/:id',booksController.getBook)
router.get('/books',booksController.getAllBooks)

//update route
router.put('/:id', booksController.updateBook)

//delete route
router.delete('/:id',booksController.deleteBook)

module.exports = router;