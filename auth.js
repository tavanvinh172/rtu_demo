const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const db = require("./models");
const { myCache, rtuKey, enableAutoSendFile } = require("./constants/cache");
const { where } = require("sequelize");
const Rtu = db.rtu;
const Status = db.status;
const User = db.user;
module.exports = {
  init: () => {
    passport.use(
      new LocalStrategy(
        { usernameField: "username" },
        async (username, password, done) => {
          const user = await User.findOne({ where: { username } });
          if (!user) return done(null, false);
          var rtu = null;
          if (user) {
            rtu = await Rtu.findOne({ where: { UserId: user.dataValues.id } });
          }
          if (rtu) {
            const status = await Status.findOne({
              where: { rtuId: rtu.dataValues.id },
            });
            if (status) {
              myCache.set(enableAutoSendFile, status.dataValues.enableSendFile);
              myCache.set(rtuKey, rtu.dataValues);
            }
          }
          if (password && user.dataValues.password) {
            if (!bcrypt.compareSync(password, user.dataValues.password))
              return done(null, false);
          }
          return done(null, user);
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      const user = await User.findOne({ where: { id } });
      done(null, user);
    });
  },
  protectRoute: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login?next=" + req.url);
  },
};
