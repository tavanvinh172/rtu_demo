const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../../models");

const User = db.user;

module.exports = {
  loginApi: async (req, res) => {
    const { username, password } = req.body;
    try {
      // Find the user by username
      const user = await User.findOne({ where: { username } });
      // Check if user exists
      if (!user) {
        return res.status(404).send("No user found.");
      }

      // Compare the password
      const passwordIsValid = bcrypt.compareSync(
        password,
        user.dataValues.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({ auth: false, token: null });
      }

      // Sign the JWT token
      const token = jwt.sign({ id: user.dataValues.id }, "supersecret", {
        expiresIn: 86400, // expires in 24 hours
      });

      // Send the response with the token
      res.status(200).send({ auth: true, token: token, isRtu: true });
    } catch (err) {
      // Handle any errors
      res.status(500).send(err);
    }
  },

  pingRtuApi: async (req, res) => {
    try {
      res.status(200).send({
        status: "Pong",
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
