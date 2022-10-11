const jwt = require("jsonwebtoken");
const variables = require("../config/variables");
const Users = require("../models/users");
const Roles = require("../models/roles");

module.exports = {
  isLoggedIn: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; //Equal to if(authHeader) { ... }
    if (accessToken == null) return res.status(401).json({ success: false, status: "No accessToken", error: "AccessToken not present." });

    jwt.verify(accessToken, variables.authentication.access_token_secret, (err, user) => {
      if (err) return res.status(403).json({ success: false, status: "Invalid accessToken", error: err });
      req.user = user; //binds the logged in userId and email to req.user object
      console.log("isLoggedIn: ", req.user.id);
      next();
      return;
    });
  },

  hasRole: (roleName) => {
    return (req, res, next) => {
      console.log("isAdmin: ", roleName);
      Users.findByPk(req.user.id, {
        include: [{ model: Roles }],
        attributes: {
          exclude: ["password"],
        },
      })
        .then((user) => {
          const role = user.roles.filter((role) => role.name === roleName)[0];
          if (!role) {
            return res.status(401).json({ success: false, status: "Unauthorized user", message: "You are not authorized for this operation.", error: null });
          }
          next();
          return;
        })
        .catch((error) => next(error));
    };
  },
};
