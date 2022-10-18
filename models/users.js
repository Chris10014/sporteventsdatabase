const Sequelize = require("sequelize");
const sequelize = require("../services/database");
const Roles = require("./roles");
const Teams = require("./teams");

const Users = sequelize.define(
  "users",
  {
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: "Vorname muss zwischen 3 und 30 Buchstaben haben.",
        },
      },
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: "Nachname muss zwischen 3 und 30 Buchstaben haben.",
        },
      },
    },
    nickname: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [3, 30],
          msg: "Nickname muss zwischen 3 und 30 Buchstaben haben.",
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Bitte eine richtige E-Mail Adresse angeben.",
        },
        isUnique(value) {
          return Users.findOne({ where: { email: value } }).then((email) => {
            if (email) {
              throw new Error("E-mail " + value + " already exists.");
            }
          });
        },
      },
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 64],
          msg: "Passwort muss aus 6 bis 64 Zeichen bestehen.",
        },
      },
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
          msg: "Bitte eine richtige Jahreszahl eingeben (JJJJ).",
        },
      },
    },
    country_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    email_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    activation_token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    last_login: {
      type: Sequelize.DATE,
      defautValue: null,
    },
    //separate updated_at to update it independently from last_login
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // alias createdAt as created_at
    updatedAt: false, // separate updated_at to a normal field to update it independently from last_login
  }
);

const users_have_roles = sequelize.define(
  "users_have_roles",
  {
    team_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  { timestamps: false }
);

Users.belongsToMany(Roles, {
  through: "users_have_roles",
  foreignKey: "user_id", //replaces userId (source model)
  otherKey: "role_id"
});

Roles.belongsToMany(Users, {
  through: "users_have_roles",
  foreignKey: "role_id", //replaces roleId (source model)
  otherKey: "user_id"
});



Roles.hasMany(Users, {
  foreignKey: "role_id",
});
Users.belongsTo(Roles, {
  // as: "role", //Alias in user model 
  foreignKey: "role_id",
});

//Users can be member in many teams and a team can have up to X team captains


module.exports = Users;