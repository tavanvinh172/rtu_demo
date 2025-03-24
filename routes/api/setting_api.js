const settingApi = require("../../controllers/api/setting_api_controller");
const express = require("express");

const router = express.Router();
const verifyToken = require("../../middlewares/verify_token");

router.post(
  "/updateSendJsonFileState",
  verifyToken,
  settingApi.updateSendJsonFileState
);

router.get("/userSelectFile/:id", verifyToken, settingApi.getUserSelectFile);

module.exports = router;
