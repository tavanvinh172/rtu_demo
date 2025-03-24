const express = require("express");
const dashboardController = require("../controllers/dashboard");
const { checkTokenAndRedirect } = require("../middlewares/authenticate");
const { protectRoute } = require("../auth");
const router = express.Router();

router.get("/", protectRoute, dashboardController.dashboardView);

router.get(
  "/download/:fileName/:id",
  protectRoute,
  dashboardController.downloadFile
);

module.exports = router;
