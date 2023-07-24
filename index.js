const express = require('express');
const serverless = require ('serverless-http');
const booksRoute=require("./src/routes/books.route")

const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/",booksRoute)



// Wrap the Express app with serverless-http to handle Lambda events
module.exports.handler = serverless(app);





