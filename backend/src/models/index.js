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
db.stateConditions = require("./stateCondition.model.js")(sequelize, Sequelize);
db.games.hasMany(db.quests, { as: "quests" });
db.quests.belongsTo(db.games, {
  foreignKey: "gameId",
  as: "game",
});
db.quests.hasMany(db.stateConditions, { as: "stateConditions" });
db.stateConditions.belongsTo(db.quests, {
  foreignKey: "questId",
  as: "quest",
});
module.exports = db;