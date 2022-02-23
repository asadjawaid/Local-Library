require("dotenv").config();
const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(conn.connection.host);
  } catch (error) {
    console.log(error.message);
    process.exit(0);
  }
};
