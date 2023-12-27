const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User", // Tham chiếu đến bảng User
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  content: { type: String, required: true },
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
