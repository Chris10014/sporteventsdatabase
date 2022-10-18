const Users = require("../models/users");
const Roles = require("../models/roles");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const variables = require("../config/variables");
const mailer = require("../services/mailer");
const utils = require("./utils");
const Teams = require("../models/teams");

//index
exports.index = (req, res, next) => {
  res.sendStatus(200);
};

//register new user --> createUser in userConteroller.js
exports.registerUser = async (req, res, next) => {
  //Check if user already exists
  Users.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      error = new Error("User could not be created because a user with email " + req.body.email + " already exists.");
      error.status = 409;
      error.title = "Duplicate email";
      error.instance = `${req.method} ${req.originalUrl}`;
      return next(error);
    }
  });
  //Generate hashed password
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    delete req.body.password_confirmation; //Field doesn't exist in model and db
    //get an activation token
    const activationToken = utils.createActivationToken();
    const tokenExpiresAt = new Date(activationToken.split(".")[1] * 1000).toLocaleString("de-DE");
    req.body.activation_token = activationToken;
    req.body.role_id = 1; //default role = user
    Users.create(req.body)
      .then(
        (user) => {
        //   Roles.findOne({ where: { name: "user" } }) //searches for role user
        //     .then((role) => {
        //       user.addRole(role); //adds user role as default to every new user
        //     })
        //     .catch((err) => next(err));
          //send activation link
          mailer.sendActivationLink(user.email, user.id, activationToken, user.first_name, ({ err, info }) => {
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
            res.status(200).json(user);
            return;
          })
        }
      )
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
};

//login a user
exports.loginUser = async (req, res, next) => {
  //Authenticate User
  Users.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user == null) {
        const error = new Error("Username and password don't match.")
        error.status= 401;
        error.title =  "Login failed";
        error.instance = `${req.method} ${req.originalUrl}`;
        return;
      }
      if (!user.activated) {
        const error = new Error("You must activate your account. Look into your email box for the email with the activation link. Or request a new activation link.");
        error.status = 403;
        error.title = "Account not activated";
        error.instance = `${req.method} ${req.originalUrl}`;
        error.resendActivationLinkUrl = `${variables.base_url}:${variables.port}/api/V1/activationLink/${user.email}`;
       return;
      }
      let userId = user.id; //makes userId available for the next then() block
      let firstName = user.first_name;
      let lastName = user.last_name;
      let nickname = user.nickname ? user.nickname : null;
      bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (result) {
            const user = {
              firstName: firstName,
              lastName: lastName,
              nickname: nickname,
              email: req.body.email,
              id: userId,
            };
            Users.findByPk(user.id).then((user) => {
              //update last_Login in users table
              user.update({ last_login: new Date() });
            });
            const accessToken = jwt.sign(user, variables.authentication.access_token_secret, { expiresIn: "1d" });
            res.status(200).json({ status: "Logged in", accessToken: accessToken, error: null });
            return;
          } else {
            const error = new Error("Username and password don't match.");
            error.status = 401;
            error.title = "Login failed";
            error.instance = `${req.method} ${req.originalUrl}`;
            next(error);
            return;
          }
        }).catch((err) => next(err));
    }).catch((err) => next(err));
};

//logout a user
exports.logoutUser = (req, res, next) => {
  // Still to define logout procedure
  if (!req.user) {
    const error = new Error("You are not logged in.");
    error.status = 400;
    error.title = "Not logged in";
    error.instance = `${req.method} ${req.originalUrl}`;
    next(error);
    return;
  }
  res.status(200).clearCookie("auth-token").json({ success: true, status: "Cookie cleared", error: null, accessToken: null });
};

//activate an user account
exports.activateAccount = (req, res, next) => {
  const activationToken = req.params.activationToken;
  const tokenExpiresAt = req.params.activationToken.split(".")[1];
  const userId = req.params.userId;
  if (!req.params.activationToken || !req.params.userId) {
    const error = new Error("No activation token or userId present.");
    error.status = (400);
    error.title = "Data missing";
    error.instance = `${req.method} ${req.originalUrl}`;
    next(error);
    return;
  }
  //first check if account with userId exists
  Users.findByPk(userId).then((user) => {
    if (!user) {
      const error = new Error(`User with id ${userId} not found.`);
      error.status = 400;
      error.title = "Unknown user";
      error.instance = `${req.method} ${req.originalUrl}`;
      next(error);
      return;
    }
    //check if account already activated
    if (user.activated) {
      res.status(200).json({ success: true, title: "Already activated", details: `User with id ${userId} was already activated.`, user: user });
      return;
    }
    if (activationToken !== user.activation_token) {
       const error = new Error("Invalid activation token. Request a new activation link.");
       error.status = 400;
       error.title = "Invalid token";
       error.instance = `${req.method} ${req.originalUrl}`;
       error.resendActivationLinkUrl = `${variables.base_url}:${variables.port}/api/V1/activationLink/${user.email}`;
       next(error);
       return;
    }
    if (tokenExpiresAt < new Date().getTime() / 1000) {
      const error = new Error("Activation token is expired. Request a new activation link.");
      error.status = 400;
      error.title = "Expired token";
      error.instance = `${req.method} ${req.originalUrl}`;
      error.resendActivationLinkUrl = `${variables.base_url}:${variables.port}/api/V1/activationLink/${user.email}`;
      next(error);
      return;
    }
    user
      .update({
        email_verified: true,
        activated: true,
        activation_token: null,
        updated_at: new Date(),
      })
      .then((user) => {
        res.status(200).json({ success: true, status: "Activated", user: user });
        return;
      });
  });
  return;
};

//resend activation link
exports.resendActivationLink = (req, res, next) => {
  const email = req.params.email;
  if (!email) {
     const error = new Error("E-Mail address is missing.");
     error.status = 400;
     error.title = "Empty request";
     error.instance = `${req.method} ${req.originalUrl}`;
     next(error);
     return;
  }
  Users.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        const error = new Error(`User with id ${userId} not found.`);
        error.status = 400;
        error.title = "Unknown user";
        error.instance = `${req.method} ${req.originalUrl}`;
        next(error);
        return;
      }
      if (user.activated) {
        const error = new Error(`User with email address ${email} is already activated.`);
        error.status = 400;
        error.title = "Already activated";
        error.instance = `${req.method} ${req.originalUrl}`;
        next(error);
        return;
      }
      //send activation link
      const activationToken = utils.createActivationToken();
      user
        .update({
          activation_token: activationToken,
          updated_at: new Date(),
        })
        .then(() => {
          mailer.sendActivationLink(user.email, user.id, activationToken, user.first_name, ({ err, info }) => {
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
            res.status(200).json({ success: true, status: "Activation link send", messageId: info.messageId, error: null });
            return;
          });
        }).catch((err) => next(err));
    }).catch((err) => next(err));
};

exports.deleteUserAccount = ((req, res, next) => {
  if(!req.user.id || !req.params.userId) {
     const error = new Error("No user data present or user not logged in.");
     error.status = 400;
     error.title = "Empty request";
     error.instance = `${req.method} ${req.originalUrl}`;
     next(error);
     return;
  }
  if(req.user.id*1 !== req.params.userId*1) {
     const error = new Error(`Not allowed to delete user with id ${req.params.userId}.`);
     error.status = 400;
     error.title = "Not authorized";
     error.instance = `${req.method} ${req.originalUrl}`;
     next(error);
     return;
  }
  let userId = req.user.id;
  Users.findByPk(userId).then((user) => {
    if (!user) {
       const error = new Error(`No User with id ${userId} found.`);
       error.status = 400;
       error.title = "Unknown user id";
       error.instance = `${req.method} ${req.originalUrl}`;
       next(error);
       return;
    }
    req.user = null;
    user.destroy()
    res.status(200).json({ success: true, status: "User account deleted", details: `User with Id ${userId} deleted.` });
    //to be done: logout user after account is deleted
    return;
  });

});

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 * todo: primary key over all 3 columns of the junction table
 * example: [{user_id: 1, role_id: 4, team_id: 1}, {user_id: 1, role_id: 4, team_id: 2}} must be possible
 */

exports.addRoleTeamCaptain = (req, res, next) => {
  const userId = req.body.user_id;
  const teamId = req.body.team_id;
  console.log("addTeamCaptain: ", userId + ", " + teamId);
  //Check is user is and team id present
  if(!userId || !teamId) {
    const error = new Error("User id or team id is missing");
    error.status = 400;
    error.title = "Data missing";
    error.instance = `${req.method} ${req.originalUrl}`;
    return next(error);
  }
  //Check if user and team exist
  Users.findByPk(userId, {
    include: [{ model: Roles }, { model: Teams }],
    attributes: {
      exclude: ["password"],
    }
  })
  .then((user) => {
    if(!user) {
        const error = new Error(`User with id ${userId} not found.`);
        error.status = 400;
        error.title = "Unknown user";
        error.instance = `${req.method} ${req.originalUrl}`;
        next(error);
        return;
    }
    Teams.findByPk(teamId)
    .then((team) => {
      if (!team) {
        const error = new Error(`Team with id ${teamId} not found.`);
        error.status = 400;
        error.title = "Unknown team";
        error.instance = `${req.method} ${req.originalUrl}`;
        next(error);
        return;
      }
      const userRole = user.roles.filter((role) => role.name.toLowerCase() === "teamcaptain" && role.users_have_roles.team_id === teamId)[0];
      if (userRole) {
        return res.status(200).json({ success: true, title: "Already team captain", details: `The user with id ${userId} is already team captain of the team with id ${teamId}.`, user: user });
      }
      //Then add the role with the new team id again
      Roles.findOne({ where: { name: "teamCaptain" } }) //searches for role
        .then((role) => {
          user
            .addRole(role, { through: { team_id: teamId } })
            .then(() => {
              Users.findByPk(userId, {
                include: [{ model: Roles }, { model: Teams }],
                attributes: {
                  exclude: ["password"],
                },
              }).then((user) => {
                return res.status(201).json({ success: true, title: "Role created", details: `User with id ${userId} is now team captain of team with id ${teamId}.`, user: user });
              });
            })
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
      

      console.log(userRole);
      // return res.status(200).json(userRoles);
    }).catch((error) => next(error));
  }).catch((error) => next(error));
  
};
