const { myCache, rtuKey } = require("../constants/cache");
const { settings } = require("../constants/global_variable");
const db = require("../models");
const Logs = db.logs;
module.exports = {
  logView: async (req, res) => {
    res.render("logs");
  },

  createLog: async (req, res) => {
    const { ...rest } = req;
    await Logs.create({ ...rest });
  },

  getAllLogs: async (req, res) => {
    // const logs = await
  },
};
