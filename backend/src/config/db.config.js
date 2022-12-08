require('dotenv').config({path: '../.env'});

module.exports = {
  HOST: process.env.MYSQL_HOST,
  USER: process.env.MYSQL_USERNAME,
  PASSWORD: process.env.MYSQL_PASSWORD,
  DB: process.env.MYSQL_DATABASE,
  dialect: "mysql",
  PORT: process.env.MYSQL_PORT || 3306,
  protocol: process.env.MYSQL_PROTOCOL || 'tcp',
  pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
          acquireTimeout: 10000
  }
};

// Validation of database access credentials

if (!process.env.MYSQL_USERNAME || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
throw new Error('Database access credentials were not configured correctly.');
}