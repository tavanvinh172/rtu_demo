const axios = require("axios");
const { baseUrlStage } = require("../environment/environment.development");
const axiosInstance = require("../middlewares/axiosInstance");
const db = require("../models");
const { settings } = require("../constants/global_variable");
const Rtu = db.rtu;
const Logs = db.logs;
const Status = db.status;
const bcrypt = require("bcryptjs");
const { myCache, rtuKey } = require("../constants/cache");
const { getSettings } = require("../init/init");
module.exports = {
  settingsView: async (req, res) => {
    if (myCache.get(rtuKey)) {
      const rtu = await Rtu.findOne({ where: { id: myCache.get(rtuKey).id } });
      const status = await Status.findOne({
        where: { rtuId: myCache.get(rtuKey).id },
      });
      const obj = {
        ...rtu.dataValues,
        enableSendFile: status.dataValues.enableSendFile,
      };
      res.render("settings", { rtu: obj });
    } else {
      res.render("settings", { rtu: {} });
    }
  },

  createSetting: async (req, res) => {
    const { id, ...rest } = req.body;
    if (await Rtu.findOne({ where: { id } })) {
      return;
    }
    await Rtu.create({ id, ...rest });
  },

  getSettingByRtuId: async (req, res) => {
    try {
      const { id } = req;
      const rtu = await Rtu.findOne({ where: { id: id } });
      if (rtu != null) {
        return rtu;
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteSettingByRtuId: async (req, res) => {
    try {
      const { id } = req;
      const rtu = await Rtu.findOne({ where: { id: id } });
      if (rtu != null) {
        await rtu.destroy();
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting RTU", error: error.message }); // Handle any errors
    }
  },

  updateSettingFile: async (req, res) => {
    try {
      const { id, password, ...rest } = req.body;
      var newPassword = null;
      if (password) {
        newPassword = bcrypt.hashSync(password, 8);
      }
      Rtu.update(
        {
          password: newPassword ?? bcrypt.hashSync(password, 8),
          ...rest,
        },
        {
          where: {
            id: id,
          },
        }
      );
      const response = await Rtu.findOne({ where: { id } });
      const status = await Status.findOne({
        where: { rtuId: myCache.get(rtuKey).id },
      });

      if (response != null && status != null) {
        const obj = {
          ...response.dataValues,
          enableSendFile: status.dataValues.enableSendFile,
        };
        await Logs.create({
          description: "update setting file",
          logType: "UpdateSetting",
          rtuId: id,
        });
        res.render("settings", {
          rtu: obj,
        });
        return;
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error update RTU setting", error: error.message });
    }
  },
};
