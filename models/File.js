module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    "File",
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filetype: {
        type: DataTypes.ENUM("xml", "json"),
        allowNull: false,
      },
      filepath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastDownloaded: {
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

  return File;
};
