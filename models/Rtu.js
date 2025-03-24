const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

module.exports = (sequelize, DataTypes) => {
  const Rtu = sequelize.define(
    "Rtu",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      stateName: {
        type: DataTypes.STRING,
      },
      districtName: {
        type: DataTypes.STRING,
      },
      stationName: {
        type: DataTypes.STRING,
      },
      interval: {
        type: DataTypes.INTEGER,
      },
      inActiveThreshold: {
        type: DataTypes.INTEGER,
      },
      statusName: {
        type: DataTypes.STRING,
      },
      appKey: {
        type: DataTypes.STRING,
      },
      secretKey: {
        type: DataTypes.STRING,
      },
      reference: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      ipAddress: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      version: {
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
  return Rtu;
};
