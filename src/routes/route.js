const express = require('express');
const router = express.Router();
const {userLogin,createUser} = require("../controllers/userController")
const {createBook} = require("../controllers/bookController")



router.post("/login", userLogin);
router.post("/register", createUser);
router.post("/books", createBook);

module.exports = router;