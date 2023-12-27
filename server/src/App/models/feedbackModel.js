const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  fullName: {type: String, required: true},
  email: { type: String, required: true },
  phoneNumber: { type: String },    
  feedback: { type: String, required: true },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
