const Sequelize = require("sequelize");
const sequelize = require("../services/database");
const Countries = require("./countries");
const Teams = require("./teams");
const Users = require("./users");
const EventDates = require("./eventDates");

const SportEvents = sequelize.define(
  "sportEvents",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isUnique(value) {
         return SportEvents.findOne({ where: { name: value } }).then((sportEvent) => {
            if (sportEvent) {
                throw new Error("Sport Event " + value + " already exists.");
              }
          });
        }
      },
      unique: true,
    },
    //host is one out of the teams host_id == user_id
    host_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    logo: {
      type: Sequelize.STRING,
    },
    visual: {
      type: Sequelize.STRING,
    },
    homepage: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    postal_code: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    country_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    // Owner is one of the registered users with editor rights owner_id == user_id
    owner_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    featured: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // alias createdAt as created_at
    updatedAt: "updated_at", // alias updatedAt as updated_at
  }
);

//Relations
//host is a team
Teams.hasMany(SportEvents, {
  foreignKey: "host_id",
});
SportEvents.belongsTo(Teams, {
  as: "host", // Alias for team is host
  foreignKey: "host_id",
});

//owner is a registered User with at least editor rights
Users.hasMany(SportEvents, {
  foreignKey: "owner_id",
});
SportEvents.belongsTo(Users, {
  as: "owner", // Alias for user is owner
  foreignKey: "owner_id",
});

SportEvents.hasMany(EventDates, {
  foreignKey: "sportEvent_id"
});
EventDates.belongsTo(SportEvents, {
  foreignKey: "sportEvent_id"
});

module.exports = SportEvents;