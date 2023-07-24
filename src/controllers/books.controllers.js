const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const Book = require("../models/books.models");

const tableName = "books";

// Create operation
exports.createBook = async (req, res) => {
  const { name, author, isAvailable } = req.body;
  if (!name || !author || !isAvailable) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  const bookId = uuidv4();

  const book = new Book(bookId, name, author, isAvailable);
  const params = {
    //Dynamodb  table name
    TableName: tableName,
    // Db fields with id as the dynamodb partition key
    Item: {
      id: book.id ,
      name: book.name ,
      author: book.author,
      isAvailable: book.isAvailable,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return res
      .status(200)
      .json({ success: true, message: "Book created successfully" });
  } catch (error) {
    console.error("Error creating item:", error);
    return res
      .status(400)
      .json({ success: false, message: "Error creating item" });
  }
};

// Read operation
exports.getBook = async (req, res) => {
  const partitionKey = req.params.id;
  if (!partitionKey) {
    return res
      .status(400)
      .json({ success: false, message: "Partition key is empty" });
  }
  const params = {
    TableName: tableName,
    Key: {
      id: partitionKey,
    },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) {
      return res
        .status(400)
        .json({ success: false, message: "Item not found" });
    }
    // Extract and return the relevant data from the 'data' object
    return  res
    .status(200).json( { success: true, data: data.Item });
  } catch (error) {
    console.error("Error fetching item:", error);
    return res
      .status(400)
      .json({ success: false, message: "Error fetching item" });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const params = {
      TableName: tableName,
    };

    const result = await dynamoDB.scan(params).promise();

    // Check if items were retrieved successfully
    if (result.Items && result.Items.length > 0) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Items retrieved successfully",
          items: result.Items,
        });
    } else {
      return res.status(200).json({
        success: false,
        message: "No items found in the table",
        items: [],
      });
    }
  } catch (error) {
    console.error("Error getting items:", error);
    return res.status(400). json({
      success: false,
      message: "Error getting items",
      error: error,
    });
  }
};

// Update operation
exports.updateBook = async (req,res) => {
  const partitionKey= req.params.id
  const { name, author, isAvailable } = req.body;
  try {
    const getParams = {
      TableName: tableName,
      Key: {
        id: partitionKey,
      },
    };
const bookItem= await dynamoDB.get(getParams).promise();
if(bookItem.Item){
const params = {
    TableName: tableName, 
    Key: {
      id: { S: partitionKey }, 
    },
    UpdateExpression: 'SET #n = :name, author = :author, isAvailable = :isAvailable',
    ExpressionAttributeValues: {
      ':name': name? name:bookItem.Item.name ,
      ':author': author ? author :bookItem.Item.author,
      ':isAvailable': isAvailable ? isAvailable:bookItem.Item.isAvailable,
    
    },
    ExpressionAttributeNames: {
      '#n': 'name',
    },
    ReturnValues: 'UPDATED_NEW',
  };

  
    const data = await dynamoDB.update(params).promise();
    // Extract and return the updated data from the 'data' object
    return res.status(200).json({ success: true, data: data.Attributes });
}

  
  } catch (error) {
    console.error('Error updating item:', error);
    return res.status(400).json({ success: false, message: 'Error updating item' });
  }
};

// Delete operation
exports.deleteBook = async (req,res) => {
  const partitionKey= req.params.id
  const params = {
    TableName: tableName, 
    Key: {
      id: partitionKey, 
    },
  };

  try {
    await dynamoDB.delete(params).promise();
    return res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(400).json({ success: false, message: 'Error deleting item' });
  }
};
