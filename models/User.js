const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
      },
      // email: {
      //   type: DataTypes.STRING,
      //   unique: true,
      // },
      password: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      timestamps: true, // Enable timestamps
      createdAt: "createdAt", // Custom name for createdAt field
      updatedAt: "updatedAt", // Custom name for updatedAt field
      sequelize,
      timezone: "+08:00", // Set the timezone to Malaysia (GMT+8)
    }
  );
  return User;
};
