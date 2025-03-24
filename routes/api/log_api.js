const logApi = require("../../controllers/api/log_api_controller");
const express = require("express");

const router = express.Router();
const verifyToken = require("../../middlewares/verify_token");

router.post("/getAllLogs", verifyToken, logApi.getAllLog);

module.exports = router;
