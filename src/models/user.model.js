const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  school: { type: String, required: true },
});

module.exports = mongoose.model("vdt2024", userSchema);
