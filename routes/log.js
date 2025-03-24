const express = require("express");
const logController = require("../controllers/log");
const { checkTokenAndRedirect } = require("../middlewares/authenticate");
const { protectRoute } = require("../auth");

const router = express.Router();

router.get("/logs", logController.logView, protectRoute);

module.exports = router;
