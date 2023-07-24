const express= require('express')
const router= express.Router()
const booksController= require('../controllers/books.controllers')


// Create route
router.post('/', booksController.createBook)
//read route
router.get('/',booksController.getAllBooks)
router.get('/:id',booksController.getBook)


//update route
router.put('/:id', booksController.updateBook)

//delete route
router.delete('/:id',booksController.deleteBook)

module.exports = router;