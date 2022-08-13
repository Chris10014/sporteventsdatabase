const Sequelize = require("sequelize");
const variables = require("../config/variables");

// create the connection to database
const sequelize = new Sequelize(variables.database.database, variables.database.user, variables.database.password, {
  host: variables.database.host,
  port: variables.database.port,
  dialect: variables.database.dialect,
});

module.exports = sequelize;
