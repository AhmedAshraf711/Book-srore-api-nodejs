const express = require("express");
const router = express.Router();
const { verifyTokenAndAuthorization, verifyTokenAdmin}  = require("../middlewares/verifyToken");
const { updateUser, deleteUser , getUserById ,getAllUsers  } = require("../controllers/userController");

router.route("/:id")
      .get(verifyTokenAndAuthorization,getUserById)
      .put(verifyTokenAndAuthorization,updateUser)
      .delete(verifyTokenAndAuthorization,deleteUser)
router.get("/",verifyTokenAdmin,getAllUsers);

module.exports = router;
