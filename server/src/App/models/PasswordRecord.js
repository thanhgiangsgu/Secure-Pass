const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passwordRecordSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  url: { type: String },
  note: { type: String },
  createDate: { type: Date },
});

const PasswordRecord = mongoose.model("PasswordRecord", passwordRecordSchema);

module.exports = PasswordRecord;
