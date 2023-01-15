"use strict"

const Users = require("../../models/users");
const Teams = require("../../models/teams.js");
const { rolePermissions } = require("../../permissions/rolePermissions");

//Resource /users
/**
 * Checks the allowed actions for a user on the resource /teams
 * @params {string} action - one of the CRUD actions create || read || update || delete
 * 
 * @returns {Object} req.permission
 */
exports.isAllowedToHandleTeamsById = (action) => {
  const actionAny = action + "Any";
  const actionOwn = action + "Own";

  return (req, res, next) => {
    Users.findByPk(req.user.id, {
      include: [
        {
          model: Teams,
          where: { id: req.params.teamId },
          through: { where: { team_captain: true } },
        },
      ],
    }).then((user) => {
      const permission = (user) 
      ? rolePermissions.can(req.user.role.name.toLowerCase())[actionOwn]("teams") //Own means beeing team captain
      : rolePermissions.can(req.user.role.name.toLowerCase())[actionAny]("teams");

      if (permission.granted) {
        req.permission = permission;
        return next();
      }
      const error = new Error(`You are not allowed to ${action} data from /teams/${req.params.teamId}.`);
      error.status = 403;
      error.title = "Not allowed";
      error.instance = `${req.method} ${req.originalUrl}`;
      return next(error);
    });
  };
};