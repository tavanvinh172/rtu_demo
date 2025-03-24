const passport = require("passport");
const bcrypt = require("bcryptjs");
const axiosInstance = require("../middlewares/axiosInstance");
const db = require("../models");
const { baseUrl } = require("../environment/environment.development");
const { settings } = require("../constants/global_variable");
const { myCache, tokenKey, loginKey, rtuKey } = require("../constants/cache");
const { getSettings } = require("../init/init");
const crypto = require("crypto");
const User = db.user;
const Rtu = db.rtu;
var fs = require("fs");
const cron = require("node-cron");
const { BASE_URL } = require("../constants/base_url");

module.exports = {
  registerView: (req, res) => {
    res.render("register");
  },

  loginView: async (req, res) => {
    // if (await User.findOne({ where: { username: "admin" } })) {
    //   res.render("login");
    //   return;
    // } else {
    //   await User.create({
    //     username: "admin",
    //     password: bcrypt.hashSync("admin", 8),
    //   });

    // }
    res.render("login");
  },

  registerUser: async (req, res) => {
    const { secretKey, appKey, reference, mechisUrl, username, password } =
      req.body;
    if (!secretKey || !appKey || !reference) {
      return res.render("register", { error: "Please fill all fields" });
    }

    await getSettings(secretKey, appKey, reference, mechisUrl);

    if (myCache.get(rtuKey)) {
      var { id, url, ...rest } = myCache.get(rtuKey).content;

      if (await Rtu.findOne({ where: { id } })) {
        return res.render("register", {
          error: "An RTU already exists with this reference number",
        });
      }
      var newPassword = null;
      if (password) {
        newPassword = bcrypt.hashSync(password, 8);
      }
      var userResponse;
      const isUserExist = (await User.findOne({ where: { username } })) != null;
      if (!isUserExist) {
        userResponse = await User.create({
          username: username,
          password: newPassword,
        });
      } else {
        userResponse = await User.findOne({ where: { username } });
      }

      let obj = {
        id,
        url: mechisUrl,
        ...rest,
        secretKey: secretKey,
        appKey: appKey,
        reference: reference,
        UserId: userResponse.dataValues.id,
      };
      await Rtu.create({ ...obj });
      const fileCount = await db.file.count();
      const statusCount = await db.status.count();
      if (statusCount === 0) {
        await db.status.create({
          enableSendFile: 1,
          rtuId: id,
        });
      }
      if (fileCount === 0) {
        var sysFiles = fs.readdirSync("upload");
        sysFiles.forEach(async (element) => {
          await db.file.create({
            filename: element,
            filetype: "text/xml",
            filepath: `${BASE_URL}/${element}`,
            rtuId: id,
          });
        });
      }
      res.redirect("login?registrationdone");
    } else {
      return res.render("register", {
        error: "Login information is incorrect",
      });
    }
  },

  loginUser: async (req, res) => {
    passport.authenticate("local", {
      successRedirect: "/?loginsuccess",
      failureRedirect: "/login?error",
    })(req, res);
  },

  logoutUser: (req, res) => {
    settings.token = null;
    myCache.del(tokenKey);
    myCache.del(rtuKey);
    settings.count = 0;
    res.clearCookie("token"); // Clear the 'token' cookie
    req.logout(() => res.redirect("/login?loggedout"));
  },
};
