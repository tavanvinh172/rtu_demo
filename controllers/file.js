const db = require("../models");
const User = db.user;
const File = db.file;
const Rtu = db.rtu;
const multer = require("multer");
const path = require("path");
const { IP_ADDRESS, PORT } = require("../constants/base_url");
const { where } = require("sequelize");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

module.exports = {
  uploadFileView: (req, res) => {
    res.render("file");
  },

  getUserFiles: async (req, res) => {
    const files = await File.findAll({
      where: {
        userId: 1,
      },
    });
    if (files) {
      return files.map((file) => file.dataValues);
    }
  },

  changeUserDownloadedState: async (req, res) => {
    try {
      const { fileId } = req;
      // console.log(fileId);
      File.update(
        { lastDownloaded: new Date().toLocaleString() },
        {
          where: {
            id: fileId,
          },
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  uploadFiles: async (req, res) => {
    try {
      // const { userId } = req.body;
      const user = await User.findByPk(1);
      const rtu = await Rtu.findOne();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      console.log(rtu);

      const { mimetype } = req.file;
      // console.log(req.file);
      const filetype = mimetype === "application/xml" ? "xml" : "json";

      await File.create({
        filename: req.file.originalname,
        filetype,
        filepath: `http://${IP_ADDRESS}:${PORT || 3001}/${
          req.file.originalname
        }`,
        userId: 1,
        rtuId: rtu.id,
      });

      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  findFileById: async (req, res) => {
    try {
      const { fileId } = req;
      const file = await File.findOne({ where: { id: fileId } });
      if (file != null) {
        return file;
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addMultipleFiles: async (req, res) => {
    const { files } = req;
    await File.bulkCreate(files, {
      returning: true,
    });
  },
};
