"use strict"

const { rolePermissions } = require("../../permissions/rolePermissions");

//Resource /users
/**
 * Checks the allowed actions for a user on the resource /users
 * @params {string} action - one of the CRUD actions create || read || update || delete
 * 
 * @returns {Object} req.permission
 */
exports.isAllowedToHandleUsersById = ((action) => {
  const actionAny = action + "Any";
  const actionOwn = action + "Own";

  return (req, res, next) => {
  const permission = (req.user.id == req.params.userId)
   ? rolePermissions.can(req.user.role.name.toLowerCase())[actionOwn]('users')
   : rolePermissions.can(req.user.role.name.toLowerCase())[actionAny]('users');

   if(permission.granted) {
    req.permission = permission;
    next();
    return;
   }
    const error = new Error(`You are not allowed to ${action} data from /users/${req.params.userId}.`);
    error.status = 403;
    error.title = "Not allowed";
    error.instance = `${req.method} ${req.originalUrl}`;
    return next(error);
  }
});

exports.isAllowedToCreateUsers = (req, res, next) => {
  const permission = rolePermissions.can(req.user.role.name.toLowerCase()).createAny("users");
  if(permission.granted) {
    req.permission = permission;
    return next()
  }  
  const error = new Error("You are not allowed to create new users.");
  error.status = 403;
  error.title = "Not allowed";
  error.instance = `${req.method} ${req.originalUrl}`;
  return next(error);
}