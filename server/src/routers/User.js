var express = require("express");
const router = express.Router();

const user = require("../App/controllers/User.js");
router.post("/check-email", user.checkEmail);
router.get("/show-all-email", user.showAllEmail);
router.post("/add-user", user.addUser);
router.patch("/update-user", user.updateUser);
router.delete("/delete-user/:id", user.deleteUser);
router.post("/login", user.checkLogin);
router.post("/register", user.register);
router.get("/token", user.verifyToken);
router.post("/refresh-token", user.refreshToken);
router.patch("/update-password", user.updatePassword);
router.post("/send-code", user.sendCode);
router.post("/check-code", user.checkCode);
router.post("/reset-password", user.resetPassword);
router.get("/getDataUser/:id", user.getDataUser);

module.exports = router;
