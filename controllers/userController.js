const Users = require("../models/users");
const Roles = require("../models/roles");
const Teams = require("../models/teams");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Users
exports.getAllUsers = ((req,res, next) => {
    Users.findAll({ where: req.query, attributes: { exclude: "password" },
      include: [
       { model: Roles, attributes: [ "name" ]},
       { model: Teams, attributes: [ "team_name" ]}
      ]})
      .then(
        (users) => {
          res.status(200).json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new User 
exports.createUser = (async (req, res, next) => {
    //Check if user already exists
    Users.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(409).json({ success: false, title: "Duplicate e-mail", details: "A user with email " + req.body.email + " already exists.", instance: `${req.originalUrl}` });
      }
    });
    //Generate hashed password
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
      delete req.body.password_confirmation; //Field doesn't exist in model and db
      //Create activation token
      const activationToken = crypto.randomBytes(32).toString("hex") + ";" + new Date();
      req.body.activation_token = activationToken;
      Users.create(req.body)
        .then(
          (user) => {
            Teams.findOne({ where: { name: "user" } }) //searches for role user
              .then((role) => {
                user.addRole(role); //adds user role as default to every new user
              })
              .catch((err) => next(err));
            res.status(201).json(user);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    } catch (err) {
      next(err);
    }
  });

//update one User
exports.updateUser = ((req, res, next) => {
    res.status(405).json({ success: false, title: "PUT method not allowed", details: "PUT operation is not supported on /users", instance: `${req.originalUrl}` });
    return;
});

//delete Users
exports.deleteUsers = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.status(405).json({ success: false, title: "DELETE method not allowed", details: "DELETE operation is not supported on /users", instance: `${req.originalUrl}` });
    return;
  }
  res.status(405).json({ success: false, title: "Method not allowed", details: "DELETE operation is not supported on /users", instance: `${req.originalUrl}` });
  return;
};

//get one User by Id
exports.getUserById = ((req, res, next) => {
  if (!req.params.userId) {
     res.status(400).json({ success: false, title: "Empty request", details: `The id of an user must be provided.`, instance: `${req.originalUrl}` });
     return;
  }
    Users.findByPk((req.params.userId), {
  include: [{ model: Teams, attributes: [ "name" ]}],
  attributes: {
     exclude: ['password']
  }
})
      .then((user) => {
        res.status(200).json(user);
        return;
      })
      .catch((err) => next(err));
});

//create a user with an Id
exports.createUserWithId = (req, res, next) => {
  res.status(405).json({ success: false, title: "POST method not allowed", details: "POST operation is not supported on /users/:id", instance: `${req.originalUrl}` });
  return;
};

//update one user by Id 
exports.updateUserById = (req, res, next) => {
   if (!req.params.userId) {
     res.status(400).json({ success: false, title: "Empty request", details: `The id of an user must be provided.`, instance: `${req.originalUrl}` });
     return;
   }
   if (req.user.id * 1 !== req.params.userId * 1) {
     res.status(403).json({ success: false, title: "Invalid userId", details: `User with id ${req.user.id} is not allowed to update the user with id ${req.params.userId}.`, instance: `${req.originalUrl}` });
     return;
   }

  let userId = req.params.userId;

  Users.findByPk(userId).then((user) => {
    if (!user) {
      res.status(400).json({ success: false, title: "Unknown userId", details: `No User with id ${userId} found.`, instance: `${req.originalUrl}` });
      return;
    }
    //set updated_at ...
    req.body.updated_at = new Date();
    
    user
      .update(req.body)
      .then(
        (user) => {
          res.status(200).json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
};

//delete a user by Id
exports.deleteUserById = (req, res, next) => {
   if (!req.params.userId) {
     res.status(400).json({ success: false, title: "Empty request", details: `The id of an user must be provided.`, instance: `${req.originalUrl}` });
     return;
   }

  let userId = req.params.userId;

  Users.findByPk(userId).then((user) => {
    if (!user) {
      res.status(404).json({ success: false, title: "Unknown user", details: `No User with Id ${userId} found to delete.`, instance: `${req.originalUrl}` });
      return;
    }
    user.destroy();
    res.status(200).json({ success: true, title: "User deleted", details: `User with Id ${userId} deleted.`, instance: `${req.originalUrl}` });
    return;
  });
};

//user role management
//Add a new role to an user
exports.addRoleToUser = (req, res, next) => {
  const userId = req.params.userId;
  const roleName = req.params.roleName;
  if(!userId || !roleName) {
    return res.status(400).json({ success: false, title: "Empty request", details: "UserId oder roleName is missing.", instance: `${req.originalUrl}` });
  }
  Users.findByPk(userId, {
    include: [{ model: Roles }],
    attributes: {
      exclude: ["password"],
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ success: false, title: "Unknown user", details: `User with Id ${userId} could not be found.`, instance: `${req.originalUrl}` });
      }
      const role = user.roles.filter((role) => role.name === roleName)[0];
      if (role) {
        return res.status(200).json(user);
      }
      Roles.findOne({ where: { name: roleName } }) //searches for role
        .then((role) => {
          if(!role) {
            return res.status(404).json({ success: false, status: "Unknown role", message: `Role ${roleName} doesn't exist.`, instance: `${req.originalUrl}` })
          }
          user.addRole(role) //adds role to the user
         .then(() => {
              Users.findByPk(userId, {
                include: [{ model: Roles }],
              }).then((user) => {
                return res.status(200).json(user);
              }).catch((err) => next(err));
            }).catch((err) => next(err));
        }).catch((err) => next(err));
    }).catch((err) => next(err));
};

//Remove a role from a user
exports.removeRoleFromUser = (req, res, next) => {
  const userId = req.params.userId;
  const roleName = req.params.roleName;
  if(!userId || !roleName) {
    return res.status(400).json({ success: false, title: "Empty request", details: "UserId oder roleName is missing.", instance: `${req.originalUrl}` });
  }
  Users.findByPk(userId, {
    include: [{ model: Roles }],
    attributes: {
      exclude: ["password"],
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ success: false, title: "Unknown user", details: `User with Id ${userId} not found.`, instance: `${req.originalUrl}` });
      }
      const role = user.roles.filter((role) => role.name === roleName)[0];
      if (!role) {
        return res.status(200).json(user);
      }
      Roles.findOne({ where: { name: roleName } }) //searches for role
        .then((role) => {
          if (!role) {
            return res.status(404).json({ success: false, title: "Unknown role", details: `Role ${roleName} doesn't exist.`, instance: `${req.originalUrl}` });
          }
         user.removeRole(role) //remove role from a the user
         .then(() => {
              Users.findByPk(userId, {
                include: [{ model: Roles }],
              }).then((user) => {
                return res.status(200).json(user);
              }).catch((err) => next(err));
            }).catch((err) => next(err));
        }).catch((err) => next(err));
    }).catch((err) => next(err));
}

//Teammanagement
//Add a new team to an user
exports.addTeamToUser = (req, res, next) => {
  const userId = req.params.userId;
  const teamName = req.params.teamName;
  if (!userId || !teamName) {
    return res.status(400).json({ success: false, title: "Empty request", details: "UserId or teamName is missing.", instance: `${req.originalUrl}` });
  }
  Users.findByPk(userId, {
    include: [{ model: Teams }],
  })
    .then((user) => {
      if (!user) {
          return res.status(404).json({ success: false, title: "Unknown user", details: `A user with id ${userId} cold not be found.`, instance: `${req.originalUrl}` });
      }
      const team = user.teams.filter((team) => team.team_name === teamName)[0];
      if (team) {
        return res.status(200).json(user);
      }
      Teams.findOne({ where: { team_name: teamName } }) //searches for team
        .then((team) => {
          if (!team) {
            return res.status(404).json({ success: false, title: "Unknown team", details: `A team ${teamName} doesn't exist.`, instance: `${req.originalUrl}` });
          }
          user
            .addTeam(team) //adds team to the user
            .then(() => {
              Users.findByPk(userId, {
                include: [{ model: Teams }],
              }).then((user) => {
                return res.status(200).json(user);
              }).catch((err) => next(err));
            }).catch((err) => next(err));         
        }).catch((err) => next(err));
    }).catch((err) => next(err));
};

//Remove a team from a user
exports.removeTeamFromUser = (req, res, next) => {
  const userId = req.params.userId;
  const teamName = req.params.teamName;
  if (!userId || !teamName) {
    return res.status(400).json({ success: false, title: "Empty request", details: "UserId oder teamName missing.", instance: `${req.originalUrl}` });
  }
  Users.findByPk(userId, {
    include: [{ model: Teams }]
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ success: false, title: "Unknown user", details: `User with id ${userId} could not be found.`, instance: `${req.originalUrl}`});
      }
      const team = user.teams.filter((team) => team.team_name === teamName)[0];
      if (!team) {
        return res.status(200).json(user);
      }
      Teams.findOne({ where: { team_name: teamName } }) //searches for team
        .then((team) => {
          if (!team) {
            return res.status(404).json({ success: false, title: "Unknown team", details: `Team ${teamName} doesn't exist.`, instance: `${req.originalUrl}` });
          }
          user.removeTeam(team) //remove team from a the user
          .then(() => {
              Users.findByPk(userId, {
                include: [{ model: Teams }],
              }).then((user) => {
                return res.status(200).json(user);
              }).catch((err) => next(err));
            }).catch((err) => next(err)); 
        }).catch((err) => next(err));
    }).catch((err) => next(err));
}
