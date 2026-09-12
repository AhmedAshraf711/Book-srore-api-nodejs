const Book = require("../models/Book");
const asyncHandler = require("express-async-handler");
const createBookSchema = require("../validation/StoreBookValidation");
const updateBookSchema = require("../validation/UpdateBookValidation");

/**
 * @desc Get All Books
 * @route /api/books
 * @method GET
 * @access public
 */
const getAllBooks = asyncHandler(async (req, res) => {
  const search = req.query.search?.trim();
  const { minPrice, maxPrice } = req.query;
  const parsedMinPrice = minPrice === undefined ? undefined : Number(minPrice);
  const parsedMaxPrice = maxPrice === undefined ? undefined : Number(maxPrice);

  if (
    (minPrice !== undefined && !Number.isFinite(parsedMinPrice)) ||
    (maxPrice !== undefined && !Number.isFinite(parsedMaxPrice))
  ) {
    return res
      .status(400)
      .json({ message: "minPrice and maxPrice must be valid numbers" });
  }

  if (
    parsedMinPrice !== undefined &&
    parsedMaxPrice !== undefined &&
    parsedMinPrice > parsedMaxPrice
  ) {
    return res
      .status(400)
      .json({ message: "minPrice cannot be greater than maxPrice" });
  }

  const filter = {};
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  }
  if (parsedMinPrice !== undefined || parsedMaxPrice !== undefined) {
    filter.price = {};
    if (parsedMinPrice !== undefined) filter.price.$gte = parsedMinPrice;
    if (parsedMaxPrice !== undefined) filter.price.$lte = parsedMaxPrice;
  }
  const pageNumber = req.query.pageNumber;
  const validPageNumber =
    pageNumber === undefined ? undefined : Number(pageNumber);
  if (
    (validPageNumber != undefined && !Number.isFinite(validPageNumber)) ||
    validPageNumber < 1
  ) {
    res.status(400).json({ message: "page number must be a number" });
  }
  const bookPerPage = 2;
  const books = await Book.find(filter)
    .skip((validPageNumber - 1) * bookPerPage)
    .limit(bookPerPage);
  res.status(200).json(books);
});

/**
 *  @desc    Get book by id
 *  @route   /api/books/:id
 *  @method  GET
 *  @access  public
 */
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404).json({ message: "Book not found" });
  } else {
    res.status(200).json(book);
  }
});

/**
 *  @desc    Create new book
 *  @route   /api/books
 *  @method  POST
 *  @access  private (only admin)
 */
const createBook = asyncHandler(async (req, res) => {
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
});

/**
 *  @desc    Update a book
 *  @route   /api/books/:id
 *  @method  PUT
 *  @access  private (only admin)
 */
const updateBook = asyncHandler(async (req, res) => {
  const { error } = updateBookSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

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
});

/**
 *  @desc    Delete a book
 *  @route   /api/books/:id
 *  @method  DELETE
 *  @access  private (only admin)
 */
const deletBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404).json({ message: "Book not found" });
  } else {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  }
});

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deletBook
};
