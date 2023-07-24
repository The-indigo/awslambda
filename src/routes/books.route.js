const express= require('express')
const router= express.Router()
const userController= require('../controllers/books.controllers')


// Create operation
router.post('/books', userController.createBook)

module.exports = router;