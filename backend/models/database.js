const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  "railway",
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    port: process.env.PGPORT,
  }
);

module.exports = sequelize;
