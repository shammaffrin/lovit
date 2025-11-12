const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

app.get("/", (req, res) => {
  res.send("Lovit backend is running 🚀");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Export app instead of listening
module.exports = app;
