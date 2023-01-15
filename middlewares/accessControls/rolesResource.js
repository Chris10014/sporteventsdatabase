"use strict"

const { rolePermissions } = require("../../permissions/rolePermissions");

//Resource /users
/**
 * Checks the allowed actions for a user on the resource /users
 * @params {string} action - one of the CRUD actions create || read || update || delete
 * 
 * @returns {Object} req.permission
 */
exports.isAllowedToHandleRolesById = ((action) => {
  const actionAny = action + "Any";
  const actionOwn = action + "Own";

  return (req, res, next) => {
  const permission = (req.user.id == req.params.userId)
   ? rolePermissions.can(req.user.role.name.toLowerCase())[actionOwn]('rolePermissions')
   : rolePermissions.can(req.user.role.name.toLowerCase())[actionAny]('rolePermissions');

   if(permission.granted) {
    req.permission = permission;
    next();
    return;
   }
    const error = new Error(`You are not allowed to ${action} data from /rolePermissions/${req.params.roleId}.`);
    error.status = 403;
    error.title = "Not allowed";
    error.instance = `${req.method} ${req.originalUrl}`;
    return next(error);
  }
});

exports.isAllowedToCreateRoles = (req, res, next) => {
  const permission = rolePermissions.can(req.user.role.name.toLowerCase()).createAny("rolePermissions");
  if(permission.granted) {
    req.permission = permission;
    return next()
  }  
  const error = new Error("You are not allowed to create new rolePermissions.");
  error.status = 403;
  error.title = "Not allowed";
  error.instance = `${req.method} ${req.originalUrl}`;
  return next(error);
}