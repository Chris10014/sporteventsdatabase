const Sequelize = require("sequelize");
const sequelize = require("../services/database");
const Countries = require("../models/countries");

const Teams = sequelize.define(
  "teams_and_hosts",
  {
    team_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 50],
          msg: "Teamname muss min. 5 und max. 50 Buchstaben, Zahlen enthalten.",
        },
        is: {
          args: /^[a-zA-Z0-9ßäöüÄÖÜ&!():+\-\/\s]+$/i,
          msg: "Nur Buchstaben, Zahlen und Sonderzeichen !():+- zulässig."
        }
      },
    },
    postal_code: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[a-zA-ZßäöüÄÖÜ()\-\/\s]+$/i,
          msg: "Nur Buchstaben und die Sonderzeichen ()-/ zulässig."
        }
      },
    },
    country_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // alias createdAt as created_at
    updatedAt: "updated_at", // alias updatedAt as updated_at
  }
);

module.exports = Teams;