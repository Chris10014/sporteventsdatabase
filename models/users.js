const Sequelize = require("sequelize");
const sequelize = require("../services/database");
const Roles = require("./roles");

const Users = sequelize.define(
  "users",
  {
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nick_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Richtige E-Mail Adresse angeben.",
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [["M", "W", "D"]],
      },
    },
    year_of_birth: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        is: {
          args: /^(19|20)\d{2}$/i, //Jahreszahl 1900 - 2099
          msg: "Bitte eine valide Jahreszahl eingeben (JJJJ).",
        },
      },
    },
    country_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    email_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    activated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // alias createdAt as created_at
    updatedAt: "updated_at", // alias updatedAt as updated_at
  }
);

Users.belongsToMany(Roles, {
  through: "users_have_roles",
  foreignKey: "user_id", //repalces userId (source model)
  otherKey: "role_id"
});

Roles.belongsToMany(Users, {
  through: "users_have_roles",
  foreignKey: "role_id", //replaces roleId (source model)
  otherKey: "user_id"
});

module.exports = Users;