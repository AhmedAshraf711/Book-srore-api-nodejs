const books = require("./data");
const Book = require("./models/Book");
const connectToDB = require("./config/db");
require("dotenv").config();

connectToDB();

const importBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("book imported");
  } catch {
    console.log("error");
    process.exit(1);
  }
};

const removeBooks = async () => {
  try {
    await Book.deleteMany();
    console.log("book removed");
  } catch {
    console.log("error");
    process.exit(1);
  }
};


  if (process.argv[2] === "-import") {
    importBooks();
  }
   else if (process.argv[2] === "-remove") {
    removeBooks();
  }
