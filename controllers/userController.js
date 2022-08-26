const Users = require("../models/users");
const bcrypt = require("bcrypt");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Users
exports.getAllUsers = ((req,res, next) => {
    Users.findAll({ where: req.query })
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
exports.createUser = ((req, res, next) => {
  if(!Object.keys(req.body).length) {
    console.log("empty request", req.body);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send("Data is missing.");
    return;
  }
  console.log("user: ", req.body);
  // const salt = bcrypt.genSalt(10); // default 10
  // const hashedPassword = bcrypt.hash(req.body.password, salt);
  // console.log(salt);
  // console.log (hashedPassword);
  // req.body.password = hashedPassword;

    Users.create(req.body)
      .then(
        (user) => {
          console.log("User created: ", user);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//update one User
exports.updateUser = ((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /users");
});

//delete Users
exports.deleteUsers = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.statusCode = 403;
    res.end("Delete is not supported on /users.");
  }
  res.statusCode = 403;
  res.end("Delete is not supported on /users.");
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