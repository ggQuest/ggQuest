require('dotenv').config({path: '../.env'});

module.exports = {
    HOST: "localhost",
    USER: process.env.MYSQL_USERNAME,
    PASSWORD: process.env.MYSQL_PASSWORD,
    DB: process.env.MYSQL_DATABASE,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };