const express = require("express");
const router = express.Router();
const { createUser, userLogin, forgetPassword } = require("../controllers/authController");
const {verifyToken} = require("../middlewares/verifyToken");

router.post('/register',createUser);
router.post('/login',verifyToken,userLogin);
router.get('/forggot-password',forgetPassword);

module.exports = router;
