"use strict";

const Sports = require("../../models/sportEvents");
const { rolePermissions } = require("../../permissions/rolePermissions");

//Resource /sportEvents
/**
 * Checks the allowed actions for a user on the resource /sportEvents
 * @params {string} action - one of the CRUD actions create || read || update || delete
 * 
 * @returns {Object} req.permission
 */
exports.isAllowedToHandleSportsById = (action) => {
  const actionAny = action + "Any";
  const actionOwn = action + "Own";

  return (req, res, next) => {
    const permission = rolePermissions.can(req.user.role.name.toLowerCase())[actionAny]("sports")
    if (permission.granted) {
      req.permission = permission;
      return next();
    }
    const error = new Error(`You are not allowed to ${action} data from /sports/${req.params.sportId}.`);
    error.status = 403;
    error.title = "Not allowed";
    error.instance = `${req.method} ${req.originalUrl}`;
    return next(error);
  };
};

exports.isAllowedToCreateSports = (req, res, next) => {
  const permission = rolePermissions.can(req.user.role.name.toLowerCase()).createAny("sports");
  if (permission.granted) {
    req.permission = permission;
    return next();
  }
  const error = new Error("You are not allowed to create new sports.");
  error.status = 403;
  error.title = "Not allowed";
  error.instance = `${req.method} ${req.originalUrl}`;
  return next(error);
};