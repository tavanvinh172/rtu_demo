const { where } = require("sequelize");
const File = require("./file");

module.exports = {
  dashboardView: async (req, res) => {
    req.toastr.success("Welcome to the home page!", "Success");
    // var fs = require("fs");
    // const files = await File.getUserFiles(1);
    res.render("dashboard");
  },

  downloadFile: async (req, res) => {
    // console.log(req.params);
    // const file = await File.findFileById({ fileId: Number(req.params.id) });
    res.download(`upload\\${req.params.fileName}`, async (err) => {
      if (err) {
        // Handle error, such as file not found
        console.error("Error downloading file:", err);
        res.status(404).send("File not found");
      } else {
        await File.changeUserDownloadedState({ fileId: Number(req.params.id) });
        console.log("File is sent successfully");
      }
    });
  },
};
