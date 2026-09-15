const express = require("express");
const router = express.Router();
const { createUser, userLogin, getForgotPasswordView , sendForgotPasswordLink,getResetPasswordView,resetThePassword } = require("../controllers/authController");
const {verifyToken} = require("../middlewares/verifyToken");

router.post('/register',createUser);
router.post('/login',userLogin);
router.route('/forgot-password')
      .get(getForgotPasswordView)
      .post(sendForgotPasswordLink);

router.route('/reset-password/:userId/:token')
      .get(getResetPasswordView)
      .post(resetThePassword)

console.log(router.stack.map(r => r.route && {
  path: r.route.path,
  methods: r.route.methods
}));
module.exports = router;
