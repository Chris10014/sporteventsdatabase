const Sequelize = require("sequelize");
const sequelize = require("../services/database");
const Sports = require("./sports");
const Courses = require("./courses");

const Races = sequelize.define(
  "races",
  {
    sportEvent_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    competition: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    sport_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    virtual: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: true,
    createdAt: "created_at", // alias createdAt as created_at
    updatedAt: "updated_at", // alias updatedAt as updated_at
  }
);

//Relations
Sports.hasMany(Races, {
  foreignKey: "sport_id"
});
Races.belongsTo(Sports, {
  foreignKey: "sport_id"
});

Races.hasMany(Courses, {
  foreignKey: "race_id",
});
Courses.belongsTo(Races, {
  foreignKey: "race_id",
});

module.exports = Races;