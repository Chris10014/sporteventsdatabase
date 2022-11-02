"use strict"

const Users = require("../models/users");
const Roles = require("../models/roles");
const Teams = require("../models/teams");
const mailer = require("../services/mailer");
const utils = require("./utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { roles } = require("../permissions/users");


//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Users
exports.getAllUsers = ((req, res, next) => {
    Users.findAll({ where: req.query, attributes: { exclude: "password" },
      include: [
       { model: Roles, attributes: [ "name" ]},
       { model: Teams, attributes: [ "team_name" ]}
      ]})
      .then(
        (users) => {
          return res.status(200).json(scopedUsers(req.user, users));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new User 
exports.createUser = (async (req, res, next) => {
    //Check if user with this email already exists
    Users.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        const error = new Error("A user with email " + req.body.email + " already exists.");
        error.status = 409;
        error.title = "Duplicate email";
        error.instance = `${req.method} ${req.originalUrl}`;
        return next(error);
      }
    });
    //Generate hashed password
    try {
      const salt = await bcrypt.genSalt(10);

      let sanitizedData = req.permission.filter(req.body); //Filters data due to permission attributes
      if (!sanitizedData.password || sanitizedData.password.length == 0) {
        var randomPw = crypto.randomBytes(4).toString("hex");
        sanitizedData.password = randomPw;
      }

      const hashedPassword = await bcrypt.hash(sanitizedData.password, salt);
      sanitizedData.password = hashedPassword;
      delete sanitizedData.password_confirmation; //Field doesn't exist in model and db
      //Create activation token
      const activationToken = utils.createActivationToken();
      sanitizedData.activation_token = activationToken;
      sanitizedData.role_id = !sanitizedData.role_id ? 1 : sanitizedData.role_id; //default role = user
    
      Users.create(sanitizedData)
        .then(
          (user) => {
            //send activation link
            mailer.sendActivationLink(user.email, user.id, activationToken, user.first_name, randomPw, ({ err, info }) => {
              if (err) {
                const error = new Error(`Activation link wasn't send to the new account with email ${user.email}. Please request for an activation link again.`);
                error.status = 401;
                error.title = "Activation link not send";
                error.instance = `${req.method} ${req.originalUrl}`;
                error.resendActivationLinkUrl = `${variables.base_url}:${variables.port}/api/V1/activationLink/${user.email}`;
                error.user = user;
                next(error);
                return;
              }
              return res.status(201).json(user);
            });
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
  const error = new Error("PUT operation is not supported on /users.");
  error.status = 405;
  error.title = "Method not allowed";
  error.instance = `${req.method} ${req.originalUrl}`;
  next(error);
  return;
});

//delete Users
exports.deleteUsers = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    const error = new Error("DELETE operation is not supported on /users.");
    error.status = 405;
    error.title = "Method not allowed";
    error.instance = `${req.method} ${req.originalUrl}`;
    next(error);
    return;
  }
 const error = new Error("DELETE operation is not supported on /users.");
 error.status = 405;
 error.title = "Method not allowed";
 error.instance = `${req.method} ${req.originalUrl}`;
 next(error);
 return;
};

//get one User by Id
exports.getUserById = ((req, res, next) => {
  if (!req.params.userId) {
    const error = new Error("The id of an user must be provided.");
    error.status = 400;
    error.title = "Empty request";
    error.instance = `${req.method} ${req.originalUrl}`;
    next(error);
    return;
  }
     Users.findByPk(req.params.userId, {
       include: [{ model: Teams, attributes: ["team_name"] }],
       attributes: {
         exclude: ["password"],
       },
     })
       .then((user) => {
         if (!user) {
           const error = new Error(`User with id ${req.params.userId} not found.`);
           error.status = 404;
           error.title = "Unknown user";
           error.instance = `${req.method} ${req.originalUrl}`;
           return next(error);
         }
         res.status(200).json(req.permission.filter(user.dataValues));
         return;
       })
       .catch((err) => next(err));
});

//create a user with an Id
exports.createUserWithId = (req, res, next) => {
  const error = new Error("POST operation is not supported on /users/:id");
  error.status = 405;
  error.title = "Method not allowed";
  error.instance = `${req.method} ${req.originalUrl}`;
  next(error);
  return;
};

//update one user by Id 
exports.updateUserById = (req, res, next) => {
   if (!req.params.userId) {
    const error = new Error("The id of an user must be provided.");
    error.status = 400;
    error.title = "Empty request";
    error.instance = `${req.method} ${req.originalUrl}`;
    next(error);
    return;
   }

  let userId = req.params.userId;

  Users.findByPk(userId).then((user) => {
    if (!user) {
       const error = new Error(`No User with id ${userId} found.`);
       error.status = 400;
       error.title = "Unknown userId";
       error.instance = `${req.method} ${req.originalUrl}`;
       next(error);
       return;
    }
    //set updated_at ...
    req.body.updated_at = new Date();
    console.log("huhu: ", req.permission)
    let sanitizedData = req.permission.filter(req.body)
    user
      .update(sanitizedData)
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
    const error = new Error("The id of an user must be provided.");
    error.status = 400;
    error.title = "Empty request";
    error.instance = `${req.method} ${req.originalUrl}`;
    next(error);
    return;
   }

  let userId = req.params.userId;

  Users.findByPk(userId)
  .then((user) => {
    console.log("user: ", user)
    if (!user) {
      const error = new Error(`No User with id ${userId} found.`);
      error.status = 404;
      error.title = "Unknown userId";
      error.instance = `${req.method} ${req.originalUrl}`;
      next(error);
      return;
    }
    user.destroy();
    res.status(200).json({ success: true, title: "User deleted", details: `User with Id ${userId} deleted.`, instance: `${req.method} ${req.originalUrl}` });
    return;
  });
};

//Scoped queries

const scopedUsers = ((me, users) => {
  const permission = roles.can(me.role.name.toLowerCase()).readAny("users");
  if (permission.granted) return users;
  return users.filter((user) => user.id * 1 === me.id * 1);
})