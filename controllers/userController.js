const Users = require("../models/users");
const Roles = require("../models/roles");

const bcrypt = require("bcrypt");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Users
exports.getAllUsers = ((req,res, next) => {
    Users.findAll({ where: req.query, include: Roles })
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
    // if(!Object.keys(req.body).length) {
    //   console.log("empty request", req.body);
    //   res.statusCode = 400;
    //   res.setHeader("Content-Type", "application/json");
    //   res.send("Data is missing.");
    //   return;
    // }
    // //Check password length
    // if(!req.body.password || req.body.password.length < 6 || req.body.password.length > 64) {
    //   res.statusCode = 400;
    //   res.setHeader("Content-Type", "application/json");
    //   res.send("Password must have 6 to 64 characters.");
    //   return;
    // }
    // //Check if both password are the same
    // if(req.body.password_confirmation !== req.body.password) {
    //   res.statusCode = 400;
    //   res.setHeader("Content-Type", "application/json");
    //   res.send("Passwords don't match.");
    //   return;
    // }
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
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.end("PUT operation not supported on /users");
});

//delete Users
exports.deleteUsers = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.send("Delete is not supported on /users.");
    return
  }
  res.statusCode = 403;
  res.setHeader("Content-Type", "application/json");
  res.send("Delete is not supported on /users.");
  return
};

//get one User by Id
exports.getUserById = ((req, res, next) => {
    Users.findByPk(req.params.userId)
      .then((user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
      })
      .catch((err) => next(err));
});

//create a user with an Id
exports.createUserWithId = (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /users/:userId");
};

//update one user by Id 
exports.updateUserById = (req, res, next) => {
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
  let userId = req.params.userId;

  Users.findByPk(userId).then((user) => {
    if (!user) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No User with Id ${userId} found.`);
      return;
    }
    user.destroy();
    console.log(`User with id ${userId} deleted.`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(`User with Id ${userId} deleted.`);
  });
};