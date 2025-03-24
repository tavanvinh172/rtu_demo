module.exports = (sequelize, DataTypes) => {
  const Logs = sequelize.define(
    "Logs",
    {
      description: {
        type: DataTypes.STRING,
      },
      logType: {
        type: DataTypes.ENUM,
        values: [
          "TokenExpired",
          "SendJson",
          "UpdateSetting",
          "UpdateConnection",
        ],
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

  return Logs;
};
