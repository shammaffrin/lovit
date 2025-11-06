const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // ✅ track admin users
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
