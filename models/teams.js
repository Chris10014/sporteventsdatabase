const Sequelize = require("sequelize");
const sequelize = require("../services/database");
const Users = require("../models/users");

const Teams = sequelize.define(
  "teams",
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
        },
        isUnique(value) {
         return Sports.findOne({ where: { team_name: value } }).then((team) => {
            if (team) {
                throw new Error("Team " + value + " already exists.");
              }
          });
        },
      },
      unique: true
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

//Users can be member in many teams and a team can have up to X team captains
//User must be admitted to a team
const users_have_teams = sequelize.define(
  "users_have_teams",
  {
    team_captain: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    admitted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  },
  { timestamps: false }
);

Users.belongsToMany(Teams, {
  through: "users_have_teams",
  foreignKey: "user_id", //replaces userId (source model)
  otherKey: "team_id",
});

Teams.belongsToMany(Users, {
  through: "users_have_teams",
  foreignKey: "team_id", //replaces teamId (source model)
  otherKey: "user_id",
});

module.exports = Teams;