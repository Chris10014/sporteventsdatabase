const Sequelize = require("sequelize");
const sequelize = require("../services/database");

const Countries = sequelize.define("countries", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  country_code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone_code: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  country_name_en: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  country_name_de: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  alpha_3: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  continent_code: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  continent_name_en: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  continent_name_de: {
    type: Sequelize.STRING,
    allowNull: true,
  }},
  { 
    timestamps: true,
    createdAt: "created_at", // alias createdAt as created_at
    updatedAt: "updated_at", // alias updatedAt as updated_at
  }
);

module.exports = Countries;