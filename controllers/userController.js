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
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
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
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.send("User with email " + req.body.email + " already exists.");
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
            Roles.findOne({ where: { name: "user" } }) //searches for role user
              .then((role) => {
                user.addRole(role); //adds user role as default to every new user
              })
              .catch((err) => next(err));
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(user);
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
    res.status(403).json({ success: false, status: "Unsupported operation", error: "PUT operation is not supported on /users" });
    return;
});

//delete Users
exports.deleteUsers = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.status(403).json({ success: false, status: "Unsupported operation", error: "DELETE operation is not supported on /users" });
    return;
  }
  res.status(403).json({ success: false, status: "Unsupported operation", error: "DELETE operation is not supported on /users" });
  return;
};

//get one User by Id
exports.getUserById = ((req, res, next) => {
  if (!req.params.userId) {
     res.status(400).json({ success: false, status: "Data missing", error: `No userId present.` });
     return;
  }
    Users.findByPk((req.params.userId), {
  include: [{ model: Roles, attributes: [ "name" ]}],
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
  res.status(403).json({ success: false, status: "Unsupported operation", error: "PUT operation is not supported on /users" });
  return;
};

//update one user by Id 
exports.updateUserById = (req, res, next) => {
   if (!req.params.userId) {
     res.status(400).json({ success: false, status: "Data missing", error: `No userId present.` });
     return;
   }
   if (req.user.id * 1 !== req.params.userId * 1) {
     res.status(400).json({ success: false, status: "Invalid userId", error: `Not allowed to update user with id ${req.params.userId}.` });
     return;
   }

  let userId = req.params.userId;

  Users.findByPk(userId).then((user) => {
    if (!user) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No User with Id ${userId} found.`);
      return;
    }
    //set updated_at ...
    req.body.updated_at = new Date();
    
    user
      .update(req.body)
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
};

//delete a user by Id
exports.deleteUserById = (req, res, next) => {
   if (!req.params.userId) {
     res.status(400).json({ success: false, status: "Data missing", error: `No userId present.` });
     return;
   }

  let userId = req.params.userId;

  Users.findByPk(userId).then((user) => {
    if (!user) {
      res.status(200).json({ success: false, status: "Unknown user", error: `No User with Id ${userId} found.` });
      return;
    }
    user.destroy();
    res.status(200).json({ success: true, status: "User deleted", error: null, message: `User with Id ${userId} deleted.` });
    return;
  });
};