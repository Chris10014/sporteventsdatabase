const Sequelize = require("sequelize");
const sequelize = require("../services/database");
const SportEvents = require("./sportEvents");

const EventDates = sequelize.define(
  "eventDates",
  {
    sportEvent_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    start: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end: {
      type: Sequelize.DATE,
      allowNull: true
    }
  },
  {
    timestamps: true,
    createdAt: "created_at", // alias createdAt as created_at
    updatedAt: "updated_at", // alias updatedAt as updated_at
  }
);


module.exports = EventDates;