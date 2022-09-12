const Sequelize = require("sequelize");
const sequelize = require("../services/database");
const Users = require("./users");

const Roles = sequelize.define(
  "roles",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isUnique(value) {
          return Sports.findOne({ where: { name: value } }).then((name) => {
            if (name) {
              throw new Error("Role with name " + value + " already exists.");
            }
          });
        },
      },
      unique: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // alias createdAt as created_at
    updatedAt: "updated_at", // alias updatedAt as updated_at
  }
);

module.exports = Roles;