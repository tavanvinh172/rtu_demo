const path = require("path");
const { Sequelize } = require("sequelize");
const sqlite3 = require("sqlite3");
module.exports = new Sequelize({
  dialect: "sqlite",
  storage: "./mvc_demo.sqlite",
  // storage: path.join(__dirname, 'mvc_demo.sqlite'),
  dialect: "sqlite", // or 'mysql', 'postgres', etc.
});
