var express = require("express");
const router = express.Router();

const feedback = require("../App/controllers/Feedback.js");
router.post("/", feedback.handleFeedback);

module.exports = router;
