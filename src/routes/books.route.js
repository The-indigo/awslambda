const express= require('express')
const router= express.Router()
const booksController= require('../controllers/books.controllers')


// Create route
router.post('/books', booksController.createBook)
//read route
router.get('/:id',booksController.getBook)

module.exports = router;