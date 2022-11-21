"use strict"

const jwt = require("jsonwebtoken");
const variables = require("../config/variables");
const Users = require("../models/users");
const Roles = require("../models/roles");
const Teams = require("../models/teams");
const { getNumberOfTeamMembers } = require("../controllers/utils");

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
        const error = new Error("Your access token is not valid. Login again.");
        error.status = 403;
        error.title = "Invalid access token";
        error.instance = `${req.method} ${req.originalUrl}`;
        error.error = err;
        return next(error);
      }
      Users.findByPk(user.id, {
        include: [{ model: Roles }],
        attributes: {
          exclude: ["password"],
        },
      }).then((user) => {
        req.user = user; //binds the logged in user req.user object
        console.log("isLoggedIn: ", req.user.id);
        next();
        return;
      });
    });
  },

  /**
   * Middleware to set authorization for routes
   * @param {string} roleName role name to call a route (case insensitive for role name)
   * @returns {*} next() when the user is authorized to call and throws an error 400 if not
   */
  hasRole: (roleName) => {
    return (req, res, next) => {
      if (!roleName || roleName === null) {
        const error = new Error("A role name must be provided.");
        error.status = 400;
        error.title = "Empty request";
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
          if (!user) {
            const error = new Error(`User id ${req.user.id} not found.`);
            error.status = 400;
            error.title = "Unknown user";
            error.instance = req.originalUrl;
            return next(error);
          }
          const role = user.role.name.toLowerCase() === roleName.toLowerCase();
          if (!role || role === null) {
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

  /**
   * Middleware to check if a user is team captain of the team
   * @param {integer} req.params.teamId
   * @param {integer} req.params.userId optional
   * @param {*} next
   *
   * @return {*} next() || next(err)
   */
  isTeamCaptain: (req, res, next) => {
    const teamId = req.params.teamId;
    const userId = req.user.id;
    
    Users.findByPk(userId, {
      include: [
        {
          model: Teams,
          where: { id: teamId },
          through: { where: { team_captain: true } },
        },
      ],
    }).then((user) => {
      if (
        user //User is team captain
        || (!user && req.params.userId && req.params.userId == userId && req.originalUrl.includes("removeMember")) //User removes himself from the team
      ) {
        return next();
      }

     getNumberOfTeamMembers(teamId).then((numberOfMembers) => {
        //To admitt the first user to a team when not even a captain exists. This first member will become team captain.
        if (numberOfMembers == 0 && req.params.userId && req.params.userId == userId && req.originalUrl.includes("addMember")) {
          return next();
        } else {
          const err = new Error(`The user with id ${req.user.id} is not allowed to perform this operation. Because he is not a team captain or not even a member of the team with id ${teamId} or the team doesn't exist.`);
          err.status = 403;
          err.title = "Unauthorized";
          err.instance = `${req.method} ${req.originalUrl}`;
          return next(err);
        }
      });      
    });
  },
};