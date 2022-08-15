const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.games = require("./game.model.js")(sequelize, Sequelize);
db.quests = require("./quest.model.js")(sequelize, Sequelize);
db.stateCondition = require("./stateCondition.model.js")(sequelize, Sequelize);
db.operator = require("./operator.model.js")(sequelize, Sequelize);
db.quests.hasOne(db.games, {
  foreignKey: "gameId",
  as: "game",
});
db.quests.hasOne(db.stateCondition, {
  foreignKey: "stateConditionId",
  as: "stateCondition",
});
db.stateCondition.hasOne(db.operator, {
  foreignKey: "operatorId",
  as: "operator",
});
module.exports = db;