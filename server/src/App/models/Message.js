const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  text: { type: String },
  urlSend: { type: String },
  createDate: { type: Date, default: Date.now },
  startDate: { type: Date },
  endDate: { type: Date },
  maximumAccessCount: {
    type: Number,
    default: 0, // Giá trị mặc định là 0 hoặc giá trị tùy thuộc vào yêu cầu của bạn
  },

  accessCount: {
    type: Number,
    default: 0, // Giá trị mặc định là 0 hoặc giá trị tùy thuộc vào yêu cầu của bạn
  },

  password: { type: String, required: true },
  note: { type: String },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
