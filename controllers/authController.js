const Users = require("../models/users");
const bcrypt= require("bcrypt");

//index
exports.index = ((req, res, next) => {
    res.sendStatus(200);
});

//register new usres
exports.registerUser = ((req,res, next) => {
    res.send(200, "singup new user");
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
          res.json({ success: false, status: "Login unsuccessful!", error: "Username or Password doesn't match."});
          return;
        }
        bcrypt.compare(req.body.password, user.password)
        .then((result) => {
            if (result) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "Login successful!", error: null });
              return;
            } else {             
              res.statusCode = 401;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: false, status: "Login Unsuccessful!", error: "Password or/and email wrong." });
              return;
            }
    }).catch((err) => next(err))

    })
    .catch((err) => next(err)) 
});

//logout a user
exports.logoutUser = ((req, res, next) => {
        res.send(200, "logout user");
});