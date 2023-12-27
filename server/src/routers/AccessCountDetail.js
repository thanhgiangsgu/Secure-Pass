var express = require("express");
const router = express.Router();

const accesscountdetail = require("../App/controllers/AccessCountDetail.js");
router.post("/increase-success", accesscountdetail.increaseSuccess);
router.post("/increase-failure", accesscountdetail.increaseFailure);
router.get(
  "/show-access-count-detail-by-id/:id",
  accesscountdetail.showAccessCountDetailById
);

module.exports = router;
