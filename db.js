const mongoose = require("mongoose");
const logger = require("./logger");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/jals-db");
    logger.success("Mongo DB is connected.");
  } catch (ex) {
    logger.error("Unable to connect to DB. Details: " + ex.message);
  }
};

module.exports = connectDb;
