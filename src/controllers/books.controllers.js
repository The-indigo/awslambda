const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); 
const dynamoDB = new AWS.DynamoDB();
const Book = require('../models/books.models'); 

const tableName='books'

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
      TableName: tableName, 
      // Db fields with id as the dynamodb partition key 
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

  // Read operation
exports.getBook = async (req,res) => {
  const partitionKey= req.params.id
  if(!partitionKey){
    return res.status(401).json({ success: false, message: 'Partition key is empty' })
  }
  const params = {
    TableName: tableName, 
    Key: {
      id: { S: partitionKey }, 
    },
  };

  try {
    const data = await dynamoDB.getItem(params).promise();
    if (!data.Item) {
      return { success: false, message: 'Item not found' };
    }
    // Extract and return the relevant data from the 'data' object
    return { success: true, data: data.Item };
  } catch (error) {
    console.error('Error fetching item:', error);
    return { success: false, message: 'Error fetching item' };
  }
};