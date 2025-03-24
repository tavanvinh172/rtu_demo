const { settings } = require("../constants/global_variable");
const { myCache, loginKey } = require("../constants/cache");

const checkTokenAndRedirect = async (req, res, next) => {
  let token = req.cookies.token;
  if (myCache.get("token")) {
    res.cookie("token", settings.token, { httpOnly: true, secure: true });
    token = myCache.get("token");
  }
  if (myCache.get(loginKey)) {
    // Token exists, navigate to dashboard
    if (req.path === "/login") {
      return res.redirect("/");
    }
    return next();
  }
  if (token) {
    // Token exists, navigate to dashboard
    if (req.path === "/login") {
      return res.redirect("/");
    }
    return next();
  } else {
    // Token doesn't exist, redirect to login
    if (req.path !== "/login") {
      return res.redirect("/login");
    }
    return next();
  }
};

module.exports = {
  checkTokenAndRedirect,
};
