const jwt = require("jsonwebtoken");
const variables = require("../config/variables");
const Users = require("../models/users");
const Roles = require("../models/roles");

module.exports = {
  isLoggedIn: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; //Equal to if(authHeader) { ... }
    if (accessToken == null) {
      const error = new Error("The access token isn't present in your request.");
      error.status = 401;
      error.title = "Access token missing";
      error.instance = req.method + " " + req.originalUrl;
      return next(error);
    }
    
    jwt.verify(accessToken, variables.authentication.access_token_secret, (err, user) => {
      if (err) {
        const error = new Error("Your access token is not valid. Try to login again.");
        error.status = 403;
        error.title = "Invalid access token";
        error.instance = `${req.method} ${req.originalUrl}`;
        error.error = err;
      }
      req.user = user; //binds the logged in userId and email to req.user object
      console.log("isLoggedIn: ", req.user.id);
      next();
      return;
    });
  },

  /**
   * Middleware to set authorization for routes
   * @param {*} roleNames array with the authorized role names to call a route (case insensitive for role names)
   * @returns next() when the user is authorized to call and throws an error if not
   */
  hasRole: (roleNames) => {
    return (req, res, next) => {
      if(!Array.isArray(roleNames)) {
        const error = new Error("The parameter with the authorized roleNames to call a route must be an array.");
        error.status = 400;
        error.title = "Type error";
        error.instance = req.originalUrl;
        return next(error);
      }
      Users.findByPk(req.user.id, {
        include: [{ model: Roles }],
        attributes: {
          exclude: ["password"],
        },
      })
        .then((user) => {
          console.log("Roles: ", roleNames);
          const role = user.roles.filter((role) => roleNames.some((ele => ele.toLowerCase() === role.name.toLowerCase())))[0];
          if (!role) {
            const error = new Error("You are not authorized to perform this operation. Ask your admin to grant you the appropriate role.");
            error.status = 401;
            error.title = "Unauthorized";
            error.instance = req.method + " " + req.originalUrl;
            return next(error);
          }
          next();
          return;
        })
        .catch((error) => next(error));
    };
  },
};
