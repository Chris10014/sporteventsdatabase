const Sequelize = require("sequelize");
const sequelize = require("../services/database");
const Races = require("./races");
const Sports = require("./sports");

const Courses = sequelize.define(
  "courses",
  {
    sport_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    race_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    distance: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    timestamps: true,
    createdAt: "created_at", // alias createdAt as created_at
    updatedAt: "updated_at", // alias updatedAt as updated_at
  }
);

//Relations


Sports.hasMany(Courses, {
  foreignKey: "sport_id"
});
Courses.belongsTo(Sports, {
  foreignKey: "sport_id"
})

module.exports = Courses;