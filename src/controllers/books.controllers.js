const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); 
const dynamoDB = new AWS.DynamoDB();
const Book = require('../models/books.models'); 


// Create operation
exports.createBook = async (req,res) => {
  const {name, author, isAvailable } = req.body;
  if( !name||!author|| !isAvailable ){
    return res.status(401).json({ success: false, message: 'All fields are required' })
  }
  const bookId=uuidv4()
  

  const book = new Book(bookId, name, author, isAvailable);
    const params = {
      //Dynamodb  table name
      TableName: 'books', 
      // Db fields with partition key attributes
      Item: {
        id: { S: book.id }, 
        name: { S: book.name },
        author: {S: book.author },
        isAvailable: { BOOL: book.isAvailable },
      },
    };
  
    try {
      await dynamoDB.putItem(params).promise();
      return res.status(200).json({ success: true, message: 'Book created successfully'});
    } catch (error) {
      console.error('Error creating item:', error);
      return res.status(400).json ({ success: false, message: 'Error creating item'});
    }
  };