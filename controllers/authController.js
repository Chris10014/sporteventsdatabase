const Users = require("../models/users");
const Roles = require("../models/roles");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");
const variables = require("../config/variables");
const crypto = require("crypto"); //used to create activationToken
const sendMailController = require("../controllers/sendMailController");
const mailer = require("../services/mailer");

//index
exports.index = ((req, res, next) => {
    res.sendStatus(200);
});

//register new user --> createUser in userConteroller.js
exports.registerUser = (async (req, res, next) => {    
    //Check if user already exists
    Users.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send("User with email " + req.body.email + " already exists.");
      }
    });
    //Generate hashed password
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
      delete req.body.password_confirmation; //Field doesn't exist in model and db
      //Create activation token
      const activationToken = crypto.randomBytes(32).toString("hex") + ";" + (Math.round(new Date().getTime()/1000) + variables.activation_link_expiring_time); //Math.round(timestamp/1000) for full seconds
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
              const activationLink = variables.base_url + ":" + variables.port + "/api/v1/activate/" + user.id + "/" + activationToken;
              const to = user.email;
              const subject = "Konto aktivieren";
              const text = `Um dein Konto bei BigPoints zu aktivieren, klicke diesen Link: ${activationLink} \nDer Link ist ${variables.activation_link_expiring_time / 60} Minuten gültig.`;
              const html = `<p>Um dein Konto bei <b>BigPoints</b> zu aktivieren, klicke hier <a href="${activationLink}">BigPoints-Konto aktivieren</a>.</p><p>Der Link ist ${variables.activation_link_expiring_time / 60} Minuten gültig.</p>`;

               const mailData = {
                 from: "bigpoints@test.de",
                 to: to,
                 subject: subject,
                 text: text,
                 html: html,
               };

              mailer.transport.sendMail(mailData, (err, info) => {
                if (err) {
                  res.status(401).json({ success: false, status: "Mail not send", messageId: null, error: err, user: user });
                  return;
                }
                res.status(200).json({ success: true, status: "Mail send", messageId: info.messageId, error: null, user: user });
                return;
              });
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    } catch (err) {
      next(err);
    }
});

//login a user
exports.loginUser = ( async (req, res, next) => {
    //Authenticate User
    Users.findOne( { where: {
            email: req.body.email
        }
    }).then((user) => {
        if (user == null) {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, status: "login failed", accessToken: null, error: "Username and Password don't match."});
          return;
        }
        if(!user.activated) {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, status: "not activated", accessToken: null, error: "Account is not activated." });
          return;
        }
        let userId = user.id; //males userId available for the next then() block
        bcrypt.compare(req.body.password, user.password)        
        .then((result) => {
            if (result) {
              const user = {
                email: req.body.email,
                id: userId
              }         
              Users.findByPk(user.id).then((user) => { //update last_Login in users table
                console.log("user: ", user + " id: " + req.body.id)
                 user.update({ last_login: new Date() });
              });
              const accessToken = jwt.sign(user, variables.authentication.access_token_secret, {expiresIn: "1d"})
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "logged in", accessToken: accessToken, error: null });
              return;
            } else {             
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: false, status: "login failed", accessToken: null, error: "Username and Password don't match." });
              return;
            }
    }).catch((err) => next(err))

    })
    .catch((err) => next(err)) 
});

//logout a user
exports.logoutUser = ((req, res, next) => {
  // Still to define logout procedure
  res.status(200).clearCookie("auth-token").json({ success: true, status: "cookie cleared", error: null });
});

//activate an user account
exports.activateAccount = ((req, res, next) => {
  const activationToken = req.params.activationToken.split(";")[0];
  const tokenCreatedAt = req.params.activationToken.split(";")[1];
  const userId = req.params.userId;
  if(!req.params.activationToken || !req.params.userId) {
    res.status(400).json({ success: false, status: "data missing", error: `No activation token or userId.` });
    return;
  }
  //first check if account with userId exists
  Users.findByPk(userId)
  .then((user) => {
    if (!user) {
      res.status(400).json({ success: false, status: "unknown user", error: `User with id ${userId} not found.` });
      return;
    }
    //check if account already activated
    if (user.activated) {
      res.status(400).json({ success: false, status: "already activated", error: `User with id ${userId} is already activated.` });
      return;
    }
    if (activationToken !== user.activation_token.split(";")[0]) {
      res.status(400).json({ success: false, status: "invalid token", error: `Invalid actiation token.` });
      return;
    }
    if (tokenCreatedAt < Math.round(new Date().getTime() / 1000)) {
      res.status(400).json({ success: false, status: "expired token", error: `Activation token expired.`, resendActivationLink: `${variables.base_url}:${variables.port}/api/V1/activationLink/${user.email}` });
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
        res.status(400).json({ success: true, status: "activated", error: null, user: user });
        return;
      });
  });  
  return;
});

//resend activation link
exports.resendActivationLink = ((req, res, next) => {
  const email = req.params.email;
  if(!email) {
    res.status(400).json({ success: false, status: "data missing", error: "E-Mail address is missing."})
  }
  Users.findOne({
    where: {
      email: email
    }
  })
  .then((user) => {
    if (!user) {
      res.status(400).json({ success: false, status: "unknown user", error: `User with email ${email} doesn't exist.` });
    }
    if(user.activated) {
      res.status(400).json({ success: false, status: "already activated", error: `User with email address ${email} is already activated.` });
      return;
    }
    //send activation link
    const activationToken = crypto.randomBytes(32).toString("hex") + ";" + (Math.round(new Date().getTime() / 1000) + variables.activation_link_expiring_time);
    const activationLink = variables.base_url + ":" + variables.port + "/api/v1/activate/" + user.id + "/" + activationToken;
    
    const to = email;
    const subject = "Konto aktivieren";
    const text = `Um dein Konto bei BigPoints zu aktivieren, klicke diesen Link: ${activationLink} \nDer Link ist ${variables.activation_link_expiring_time / 60} Minuten gültig.`;
    const html = `<p>Um dein Konto bei <b>BigPoints</b> zu aktivieren, klicke hier <a href="${activationLink}">BigPoints-Konto aktivieren</a>.</p><p>Der Link ist ${variables.activation_link_expiring_time / 60} Minuten gültig.</p>`;

    const mailData = {
      from: "bigpoints@test.de",
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    user
      .update({
        activation_token: activationToken,
        updated_at: new Date(),
      })
      .then(() => {
         mailer.transport.sendMail(mailData, (err, info) => {
           if (err) {
             res.status(401).json({ success: false, status: "Mail not send", messageId: null, error: err });
             return;
           }
           res.status(200).json({ success: true, status: "Mail send", messageId: info.messageId, error: null });
           return;
         });
      }).catch((err) => next(err));   
  }).catch((err) => next(err))
});