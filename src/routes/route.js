const express = require('express');
const router = express.Router();
const {userLogin,createUser} = require("../controllers/userController")



router.post("/login", userLogin);
router.post("/register", createUser);

module.exports = router;