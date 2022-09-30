const jwt = require("jsonwebtoken")
const variables = require("../config/variables");
const Users = require("../models/users");
const Roles = require("../models/roles");

module.exports = {
    isLoggedIn: (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader && authHeader.split(" ")[1] //Equal to if(authHeader) { ... }
        if(accessToken == null) return res.status(401).json({success: false, status: "No accessToken", error: "AccessToken not present."});

        jwt.verify(accessToken, variables.authentication.access_token_secret, (err, user) => {
            if(err) return res.status(403).json({success: false, status: "Invalid accessToken", error: err});
            req.user = user //binds the logged in userId and email to req.user object
            console.log("isLoggedIn: ", req.user.id);
            next();
        })
    },

    isAdmin: ((req, res, next) => {
        // console.log("isAdmin: ", req.user);
        Users.findByPk(req.user.id, {
          include: [{ model: Roles }],
          attributes: {
            exclude: ["password"],
          }
        }).then((user) => {
          if(user) {
            console.log("isAdmin: ", user.roles);
            if(user.roles.name.includes("admin")) {
                console.log("isAdmin");
            }
            console.log("noAdmin");
            next();
          }
        
          if(!user) {
            res.status(400).json({ success: false, status: "isAdmin false", error: "No admin priveleges." })
            return;
          }
        });
       
    })

}