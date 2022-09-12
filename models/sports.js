const Sequelize = require("sequelize");
const sequelize = require("../services/database");

const Sports = sequelize.define(
  "sports",
  {
    code: {
      type: Sequelize.STRING,
      validate: {
        isUnique(value) {
          return Sports.findOne({ where: { code: value } }).then((code) => {
            if (code) {
              throw new Error("Code " + value + " for sport already exists.");
            }
          });
        },
      },
      allowNull: false,
      unique: true,
    },
    sport_de: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sport_en: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    multisport: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    verb_de: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    verb_en: {
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

module.exports = Sports;