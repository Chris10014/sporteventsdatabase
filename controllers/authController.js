const Users = require("../models/users");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");
const variables = require("../config/variables");

//index
exports.index = ((req, res, next) => {
    res.sendStatus(200);
});

//register new user --> createUser in userConteroller.js
exports.registerUser = ((req,res, next) => {
  //createUser in userConteroller.js
});

//login a user
exports.loginUser = ( async (req, res, next) => {
    //Authenticate User
    Users.findOne( { where: {
            email: req.body.email
        }
    }).then((user) => {
        console.log("from /login user: ", user); 
        if (user == null) {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, status: "login failed", accessToken: null, error: "Username and Password don't match."});
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