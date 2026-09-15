const express = require("express");
const router = express.Router();
const upload = require("./uploadImage");
const {getAllBooks, getBookById,createBook,updateBook,deletBook} = require("../controllers/bookController");
const {verifyTokenAdmin}= require("../middlewares/verifyToken");

// router.get("/",getAllBooks);
// router.get("/:id",getBookById);
// router.post("/",createBook);
// router.put("/:id",updateBook);
// router.delete("/:id",deletBook);

router.route("/")
      .get(getAllBooks)
      .post(upload.single("image"),createBook)
router.route("/:id")
      .get(getBookById)
      .put(updateBook)
      .delete(deletBook)
module.exports = router;
