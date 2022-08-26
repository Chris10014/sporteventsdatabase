const Users = require("../models/users");

//index
exports.index = ((req, res, next) => {
    res.sendStatus(200);
});

//register new usres
exports.registerUser = ((req,res, next) => {
    res.send(200, "singup new user");
});

//login a user
exports.loginUser = ((req, res, next) => {
      res.send(200, "login user");
});

//logout a user
exports.logoutUser = ((req, res, next) => {
        res.send(200, "logout user");
});