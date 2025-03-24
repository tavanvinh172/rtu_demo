const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("../../models");
const fs = require("fs");
const { settings } = require("../../constants/global_variable");
const File = db.file;

// Utility function to save metadata to the database
const saveFileMetadata = async (name, type, filePath) => {
  await File.create({ name, type, path: filePath });
};

module.exports = {
  getAllFile: async (req, res) => {
    const { pageIndex, pageSize } = req.body;
    // console.log(settings.rtuSetting);
    const limit = parseInt(pageSize);
    const offset = (pageIndex - 1) * limit;

    try {
      const files = await File.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });
      res.status(200).send({
        data: files.rows,
        currentPage: pageIndex,
        totalPages: Math.ceil(files.count / limit),
        totalItems: files.count,
      });
    } catch (error) {
      res.status(500).send({
        message: "An error occurred while retrieving posts.",
        error: error.message,
      });
    }
  },

  sendSettingFile: async (req, res) => {
    try {
      let filePath = null;
      if (req.body.Id) {
        filePath = path.join("upload\\", `${req.body.Id}.json`);
      } else {
        res.status(400).send({
          status: 400,
          message: "Id can't be null",
        });
      }
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));

      res.status(201).send({
        status: 200,
        message: "Data saved successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  downloadFile: async (req, res) => {
    try {
      const fileId = req.params.id;
      const file = await File.findByPk(fileId);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // const filePath = path.resolve(file.filepath);

      res.download(`upload\\${file.dataValues.filename}`, async (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          return res.status(500).json({ message: "Error downloading file" });
        }
        File.update(
          { lastDownloaded: new Date().toISOString() },
          {
            where: {
              id: fileId,
            },
          }
        );
        res.status(200).end();
      });
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
