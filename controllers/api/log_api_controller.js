const db = require("../../models");
const Logs = db.logs;
module.exports = {
  getAllLog: async (req, res) => {
    const { pageIndex = 1, pageSize = 10 } = req.body;
    // console.log(settings.rtuSetting);
    const limit = parseInt(pageSize);
    const offset = (pageIndex - 1) * limit;

    try {
      const logs = await Logs.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });
      res.status(200).send({
        data: logs.rows,
        currentPage: pageIndex,
        totalPages: Math.ceil(logs.count / limit),
        totalItems: logs.count,
      });
    } catch (error) {
      res.status(500).send({
        message: "An error occurred while retrieving posts.",
        error: error.message,
      });
    }
  },
};
