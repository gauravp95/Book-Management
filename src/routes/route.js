
const {userLogin} = require("../controllers/userController")



router.post("/login", userLogin);
router.post("/register", createUser);

module.exports = router;