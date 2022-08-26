const Sequelize = require("sequelize");
const sequelize = require("../services/database");
const Users = require("./users");

const Roles = sequelize.define(
  "roles",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // alias createdAt as created_at
    updatedAt: "updated_at", // alias updatedAt as updated_at
  }
);

module.exports = Roles;