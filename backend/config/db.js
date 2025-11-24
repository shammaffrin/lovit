const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("➡️ MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = conn.connections[0].readyState;
    console.log("🟢 MongoDB Connected");
  } catch (error) {
    console.error("🔴 DB Connection Failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
