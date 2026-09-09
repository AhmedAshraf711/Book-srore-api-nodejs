const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const createBookSchema = require("../validation/StoreBookValidation");
const updateBookSchema = require("../validation/UpdateBookValidation");
const Book = require("../models/Book");

//Get all books
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const search = req.query.search?.trim();
    const filter = search
      ? {
          $or: [
            { title: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
            { description: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
          ],
        }
      : {};
    const books = await Book.find(filter);
    res.status(200).json(books);
  }),
);

//Get a book by id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.status(200).json(book);
    }
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { error } = createBookSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const book = new Book({
      title: req.body.title,
      authorId: req.body.authorId,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });
    await book.save();
    res.status(201).json(book);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          authorId: req.body.authorId,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true },
    );
    return res.status(200).json(book);
  }),
);
router.delete("/:id",asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404).json({ message: "Book not found" });
  } else {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  }
}));
module.exports = router;
