var express = require("express");
const router = express.Router();

const message = require("../App/controllers/Message");
router.post("/add-message", message.addMessage);
router.patch("/update-message", message.updateMessage);
router.delete("/delete/:token/:_id", message.deleteMessage);
router.get("/show-data-with-user-id/:id", message.showAllMessageWidhUserId);
router.post("/check-message", message.checkMessage);
router.get("/show-all-message", message.showAllMessage);
router.get("/get-by-id/:id", message.showMessageById);
router.patch("/change-message-password", message.changeMessagePassword);
router.post("/notify-on-message-access", message.notifyOnMessageAccess);
router.get("/overview-statistics", message.overviewStatistics);

module.exports = router;
