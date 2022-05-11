const express = require('express');
const router = express.Router();
const {userLogin,createUser} = require("../controllers/userController")
const { createBook,getBooks, getBooksBYId, updateBook, deleteBook } = require("../controllers/bookController")
const {createReview} = require("../controllers/reviewController")


//User routes
router.post("/login", userLogin);
router.post("/register", createUser);

//Book routes
router.post("/books", createBook);
router.get("/books", getBooks);
router.get("/books/:bookId", getBooksBYId);
router.put("/books/:bookId",updateBook);
router.delete("/books/:bookId", deleteBook);

//Review

router.post("/books/:bookId/review", createReview);

module.exports = router;