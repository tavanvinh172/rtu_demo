const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/file");
const { checkTokenAndRedirect } = require("../middlewares/authenticate");
const { protectRoute } = require("../auth");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/upload", fileController.uploadFileView, protectRoute);

router.post(
  "/upload",
  upload.single("file"),
  fileController.uploadFiles,
  protectRoute
);

module.exports = router;
