const express = require("express");
const router = express.Router();
const {
  getAllAuthors,
  getOneAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");
const {verifyTokenAdmin} = require("../middlewares/verifyToken");
router.route("/")
      .get(getAllAuthors)
      .post(verifyTokenAdmin,createAuthor)
router.route("/:id")
      .get(getOneAuthor)
      .put(verifyTokenAdmin,updateAuthor)
      .delete(verifyTokenAdmin,deleteAuthor)

module.exports = router;
