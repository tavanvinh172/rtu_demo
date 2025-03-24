const express = require("express");
const fileApi = require("../../controllers/api/file_api.controller");
const verifyToken = require("../../middlewares/verify_token");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "upload/" });
router.post("/getAllFiles", verifyToken, fileApi.getAllFile);

router.get("/downloadFile/:id", verifyToken, fileApi.downloadFile);

router.post(
  "/uploadSettingFile",
  upload.single("file"),
  verifyToken,
  fileApi.sendSettingFile
);

module.exports = router;
