const {
  enableAutoSendFile,
  fileSendToMechis,
  myCache,
} = require("../../constants/cache");
const db = require("../../models");
const Status = db.status;
module.exports = {
  updateSendJsonFileState: async (req, res) => {
    try {
      const { id, enableSendFile, fileToSend } = req.body;

      const updateData = {};
      if (enableSendFile !== null && enableSendFile !== undefined) {
        updateData.enableSendFile = enableSendFile === 0 ? false : true;
        myCache.set(enableAutoSendFile, updateData.enableSendFile);
      }
      if (fileToSend) {
        updateData.fileToSend = fileToSend;
        myCache.set(fileSendToMechis, updateData.fileToSend);
      }
      if (Object.keys(updateData).length > 0) {
        await Status.update({ ...updateData }, { where: { rtuId: id } });
      }

      return res.status(200).send({ status: "success" });
    } catch (error) {
      console.error("Error updating Status setting:", error); // Log for debugging
      res.status(500).json({ message: "Error updating Status setting" });
    }
  },

  getUserSelectFile: async (req, res) => {
    try {
      const { id } = req.params;
      const status = await Status.findOne({
        where: {
          rtuId: id,
        },
      });
      if (!status) {
        return res.status(404).send("No status found.");
      }
      res.status(200).send({
        status: status,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error update Status setting", error: error.message });
    }
  },
};
