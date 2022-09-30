const Users = require("../models/users");
const Roles = require("../models/roles");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const variables = require("../config/variables");
const mailer = require("../services/mailer");
const utils = require("./utils");

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
      res.status(400).json({ success: false, status: "Double entry", error: `User with email ${req.body.email} already exists.` });
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
    Users.create(req.body)
      .then(
        (user) => {
          Roles.findOne({ where: { name: "user" } }) //searches for role user
            .then((role) => {
              user.addRole(role); //adds user role as default to every new user
            })
            .catch((err) => next(err));
          //send activation link
          mailer.sendActivationLink(user.email, user.id, activationToken, user.first_name, ({ err, info }) => {
            if (err) {
              res.status(401).json({ success: false, status: "Activation link not send", messageId: null, error: err, resendActivationLinkUrl: `${variables.base_url}:${variables.port}/api/V1/activationLink/${user.email}`, user: user });
              return;
            }
            res.status(200).json({ success: true, status: "Activation link send", messageId: info.messageId, error: null, user: user });
            return;
          });
        },
        (err) => next(err)
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
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, status: "Login failed", accessToken: null, error: "Username and password don't match." });
        return;
      }
      if (!user.activated) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, status: "Not activated", accessToken: null, error: "Account is not activated.", resendActivationLinkUrl: `${variables.base_url}:${variables.port}/api/V1/activationLink/${user.email}` });
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
            console.log("User: ", user);
            const accessToken = jwt.sign(user, variables.authentication.access_token_secret, { expiresIn: "1d" });
            res.status(200).json({ success: true, status: "Logged in", accessToken: accessToken, error: null });
            return;
          } else {
            res.status(401).json({ success: false, status: "Login failed", accessToken: null, error: "Username and Password don't match." });
            return;
          }
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

//logout a user
exports.logoutUser = (req, res, next) => {
  // Still to define logout procedure
  if(!req.user) {
    res.status(400).json({ success: false, status: "No user data", error: "No user is logged in."})
  }
  res.status(200).clearCookie("auth-token").json({ success: true, status: "Cookie cleared", error: null, accessToken: null });
};

//activate an user account
exports.activateAccount = (req, res, next) => {
  const activationToken = req.params.activationToken;
  const tokenExpiresAt = req.params.activationToken.split(".")[1];
  const userId = req.params.userId;
  if (!req.params.activationToken || !req.params.userId) {
    res.status(400).json({ success: false, status: "Data missing", error: `No activation token or userId present.` });
    return;
  }
  //first check if account with userId exists
  Users.findByPk(userId).then((user) => {
    if (!user) {
      res.status(400).json({ success: false, status: "Unknown user", error: `User with id ${userId} not found.` });
      return;
    }
    //check if account already activated
    if (user.activated) {
      res.status(400).json({ success: false, status: "Already activated", error: `User with id ${userId} is already activated.` });
      return;
    }
    if (activationToken !== user.activation_token) {
      res.status(400).json({ success: false, status: "Invalid token", error: "Invalid activation token.", resendActivationLinkUrl: `${variables.base_url}:${variables.port}/api/V1/activationLink/${user.email}` });
      return;
    }
    if (tokenExpiresAt < new Date().getTime() / 1000) {
      res.status(400).json({ success: false, status: "Expired token", error: `Activation token expired.`, resendActivationLinkUrl: `${variables.base_url}:${variables.port}/api/V1/activationLink/${user.email}` });
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
        res.status(200).json({ success: true, status: "Activated", error: null, user: user });
        return;
      });
  });
  return;
};

//resend activation link
exports.resendActivationLink = (req, res, next) => {
  const email = req.params.email;
  if (!email) {
    res.status(400).json({ success: false, status: "Data missing", error: "E-Mail address is missing." });
  }
  Users.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        res.status(400).json({ success: false, status: "Unknown user", error: `User with email ${email} doesn't exist.` });
      }
      if (user.activated) {
        res.status(400).json({ success: false, status: "Already activated", error: `User with email address ${email} is already activated.` });
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
              res.status(401).json({ success: false, status: "Activation link not send", messageId: null, error: err, resendActivationLink: `${variables.base_url}:${variables.port}/api/V1/activationLink/${user.email}` });
              return;
            }
            res.status(200).json({ success: true, status: "Activation link send", messageId: info.messageId, error: null });
            return;
          });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.deleteUserAccount = ((req, res, next) => {
  if(!req.user.id || !req.params.userId) {
    res.status(400).json({ success: false, status: "Data missing", error: "No user data present or user not logged in." });
    return;
  }
  if(req.user.id*1 !== req.params.userId*1) {
    console.log("req: ", req.user.id + " params: ", req.params.userId);
    res.status(400).json({ success: false, status: "Invalid userId", error: `Not allowed to delete user with id ${req.params.userId}.` });
    return;
  }
  let userId = req.user.id;
  Users.findByPk(userId).then((user) => {
    if (!user) {
      res.status(400).json({ success: false, status: "Unknown userId", error: `No User with Id ${userId} found.` });
      return;
    }
    req.user = null;
    user.destroy()
    res.status(200).json({ success: true, status: "User Account deleted", error: null, message: `User with Id ${userId} deleted.` });
    //to be done: logout user after account is deleted
    return;
  });

});
