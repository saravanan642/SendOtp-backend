const mongoose = require("mongoose");
const Database = async (mongoose) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(" Mongoose connected successfully");
  } catch (err) {
    console.error(" Mongoose connection failed");
    
  }
};
module.exports = Database;