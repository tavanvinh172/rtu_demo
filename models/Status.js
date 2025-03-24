const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define(
    "Status",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      enableSendFile: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      fileToSend: {
        type: DataTypes.STRING,
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
  return Status;
};
