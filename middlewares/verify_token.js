const { settings } = require("../constants/global_variable");
const { myCache, tokenKey, rtuKey } = require("../constants/cache");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  console.log(myCache.get(rtuKey));
  if (myCache.get(rtuKey)) {
    next();
    return;
  }
  const jwt = require("jsonwebtoken");
  let token = null;
  if (req.headers["authorization"] != null) {
    token = req.headers["authorization"].split(" ")[1];
  }
  if (!token) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }
  jwt.verify(token, "supersecret", (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
