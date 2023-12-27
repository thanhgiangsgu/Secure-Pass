var express = require("express");
const router = express.Router();

const auditlog = require("../App/controllers/AuditLog");
router.get("/:id", auditlog.showAuditLog);

module.exports = router;
