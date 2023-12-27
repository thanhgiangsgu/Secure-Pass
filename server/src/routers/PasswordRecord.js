var express = require("express");
const router = express.Router();

const passwordrecord = require("../App/controllers/PasswordRecord.js");
router.post("/add-passwordrecord", passwordrecord.addPasswordRecord);
router.patch("/update-passwordrecord", passwordrecord.updatePasswordRecord);
router.delete("/delete/:token/:_id", passwordrecord.deletePasswordRecord);
router.get("/show-data-with-user-id/:id", passwordrecord.showAllDataWithUserId);
// router.get('/show-all-passrecord', passwordrecord.showAllData);
router.get("/get-by-id/:id", passwordrecord.getPasswordRecordById);
// router.post('/pass-strength-analysis', passwordrecord.passwordStrengthAnalysis);
// router.get('/overview-statistics', passwordrecord.overviewStatistics);
module.exports = router;
