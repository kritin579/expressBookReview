const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
const username = req.body.username;
const password = req.body.password;

if(username && password){
if(!isValid(username)){
users.push({"username":username,"password":password});
return res.status(200).json({message:"User successfully registered. Now you can login"});
}
return res.status(404).json({message:"User already exists!"});
}

return res.status(404).json({message:"Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
return res.status(200).json(books);
});

// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
const isbn = req.params.isbn;

try {
const response = await axios.get('http://localhost:5000/');
return res.status(200).json(response.data[isbn]);
} catch (error) {
return res.status(500).json({message:error.message});
}
});

// Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
const author = req.params.author;

try {
const response = await axios.get('http://localhost:5000/');
const booksData = response.data;

```
const filteredBooks = Object.keys(booksData)
  .filter(key => booksData[key].author === author)
  .reduce((obj, key) => {
    obj[key] = booksData[key];
    return obj;
  }, {});

return res.status(200).json(filteredBooks);
```

} catch (error) {
return res.status(500).json({message:error.message});
}
});

// Get all books based on title using Promise callback
public_users.get('/title/:title', function (req, res) {
const title = req.params.title;

axios.get('http://localhost:5000/')
.then(response => {

```
  const booksData = response.data;

  const filteredBooks = Object.keys(booksData)
    .filter(key => booksData[key].title === title)
    .reduce((obj, key) => {
      obj[key] = booksData[key];
      return obj;
    }, {});

  res.status(200).json(filteredBooks);

})
.catch(error => {
  res.status(500).json({message:error.message});
});
```

});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
const isbn = req.params.isbn;
return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
