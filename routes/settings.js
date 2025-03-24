const express = require("express");
const settingController = require("../controllers/settings");
const { checkTokenAndRedirect } = require("../middlewares/authenticate");
const { getSettings } = require("../init/init");
const { protectRoute } = require("../auth");

const router = express.Router();

router.get("/settings", settingController.settingsView, protectRoute);

router.get("/getSettingFile", getSettings, protectRoute);

router.post("/settings", settingController.updateSettingFile, protectRoute);

module.exports = router;
