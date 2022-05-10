const express = require('express');
const router = express.Router();
const {userLogin,createUser} = require("../controllers/userController")
const { createBook,getBooks, getBooksBYId, updateBook } = require("../controllers/bookController")



router.post("/login", userLogin);
router.post("/register", createUser);
router.post("/books", createBook);
router.get("/books", getBooks);
router.get("/books/:bookId", getBooksBYId);
router.put("/books/:bookId", updateBook);

module.exports = router;