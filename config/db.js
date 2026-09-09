const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch {
    console.error("Could not connect to MongoDB", err);
  }
}
module.exports = connectToDB;
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('Could not connect to MongoDB', err));
 