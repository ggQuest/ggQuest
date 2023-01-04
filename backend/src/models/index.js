const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

if (!dbConfig.DB || !dbConfig.USER || !dbConfig.PASSWORD || !dbConfig.HOST || !dbConfig.dialect) {
  console.error("Database configuration parameters have not been provided correctly. ");
  process.exit(1);
}

const pool = {
  max: dbConfig.pool.max || 5,
  min: dbConfig.pool.min || 0,
  acquire: dbConfig.pool.acquire || 30000,
  idle: dbConfig.pool.idle || 10000
};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool
});

async function connectToDatabase() {
  // Check if the database already exists
  try {
    await sequelize.authenticate();
    console.log("Connection to the database was successful. ");
  } catch (err) {
    console.error("Erro ao tentar se conectar ao banco de dados:", err);
    // Se o banco de dados "ggquest" ainda não existir, criá-lo aqui
    try {
      await sequelize.createDatabase("ggquest");
      console.log("GGquest Database Created successfully.");
    } catch (err) {
      if (err.original.code === "ER_DB_CREATE_EXISTS") {
        // O banco de dados "ggquest" já existe, então se conectar a ele aqui
        try {
          await sequelize.authenticate({
            database: "ggquest",
          });
          console.log("Connection to the 'GGquest' database has been successful.");
        } catch (err) {
          console.error("Error trying to connect to the 'GGquest' database: ", err);
        }
      } else {
        console.error("Error creating the 'ggquest' database:", err);
      }
    }
  }
}

connectToDatabase();


const db = {};

if (!db.games) {
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.games = require("./game.model.js")(sequelize, Sequelize);
  db.quests = require("./quest.model.js")(sequelize, Sequelize);
  db.apiCredentials = require("./apiCredentials.model.js")(sequelize, Sequelize);
  db.stateConditions = require("./stateCondition.model.js")(sequelize, Sequelize);
  db.games.hasMany(db.quests, { 
    as: "quests",
    onDelete: 'CASCADE'
  });
  db.quests.belongsTo(db.games, {
    foreignKey: "gameId",
    as: "game",
  });
  db.quests.hasMany(db.stateConditions, { 
    as: "stateConditions",
    onDelete: 'CASCADE'
  });
  db.stateConditions.belongsTo(db.quests, {
    foreignKey: "questId",
    as: "quest",
  });
}

module.exports = db;