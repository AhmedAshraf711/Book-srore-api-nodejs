const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: true,
      trim: true,
    },

    nationality: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Author", authorSchema);

