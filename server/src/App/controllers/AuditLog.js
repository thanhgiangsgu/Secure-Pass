const AuditLogModal = require("../models/AuditLog");
const jwt = require("jsonwebtoken");

class AuditLog {
  async showAuditLog(req, res) {
    const token = req.params.id;
    const decoded = jwt.verify(token, "thanhyarn");
    const user_id = decoded.userId;
    const audit = await AuditLogModal.find({
      user_id: user_id,
    });

    if (!audit) {
      res.json({ status: "Falied" });
    } else {
      res.json({ status: "Success", audit });
    }
  }
}

module.exports = new AuditLog();
