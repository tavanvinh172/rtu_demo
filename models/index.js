const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./mvc_demo.sqlite",
  // storage: path.join(__dirname, 'mvc_demo.sqlite'),
  dialect: "sqlite", // or 'mysql', 'postgres', etc.
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./User.js")(sequelize, DataTypes);
db.file = require("./File.js")(sequelize, DataTypes);
db.logs = require("./Log.js")(sequelize, DataTypes);
db.rtu = require("./Rtu.js")(sequelize, DataTypes);
db.status = require("./Status.js")(sequelize, DataTypes);
const initializeDatabase = async () => {
  try {
    await db.sequelize.sync({ force: false }).then(async () => {
      console.log("yes re-sync done!");
    });
  } catch (err) {
    console.log("Error initializing database:", err);
  }
};

initializeDatabase();

// 1 to Many Relation

db.user.hasMany(db.file, {
  foreignKey: "userId",
  as: "userFiles",
});

db.rtu.hasMany(db.file, {
  foreignKey: "rtuId",
  as: "rtuFiles",
});

db.rtu.hasMany(db.logs, {
  foreignKey: "rtuId",
  as: "rtuLogs",
});

db.rtu.hasMany(db.status, {
  foreignKey: "rtuId",
  as: "rtuStatus",
});

db.file.belongsTo(db.user, {
  foreignKey: "userId",
  as: "ownerUser",
});

db.file.belongsTo(db.rtu, {
  foreignKey: "rtuId",
  as: "ownerRtu",
});

db.status.belongsTo(db.rtu, {
  foreignKey: "rtuId",
  as: "ownerRtu",
});

db.logs.belongsTo(db.rtu, {
  foreignKey: "rtuId",
  as: "ownerRtu",
});

db.user.hasOne(db.rtu);

db.rtu.belongsTo(db.user);
module.exports = db;
