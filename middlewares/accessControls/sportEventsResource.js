"use strict";

const SportEvents = require("../../models/sportEvents");
const { rolePermissions } = require("../../permissions/rolePermissions");

//Resource /sportEvents
/**
 * Checks the allowed actions for a user on the resource /sportEvents
 * @params {string} action - one of the CRUD actions create || read || update || delete
 * 
 * @returns {Object} req.permission
 */
exports.isAllowedToHandleSportEventsById = (action) => {
  const actionAny = action + "Any";
  const actionOwn = action + "Own";

  return (req, res, next) => {

    //retrieve sportEvent
    SportEvents.findByPk(req.params.sportEventId)
      .then((sportEvent) => {
        const ownerId = sportEvent.owner_id;
        const permission = req.user.id*1 == ownerId*1 
        ? rolePermissions.can(req.user.role.name.toLowerCase())[actionOwn]("sportEvents") 
        : rolePermissions.can(req.user.role.name.toLowerCase())[actionAny]("sportEvents");
        if (permission.granted) {
          req.permission = permission;
          return next();          
        }
        const error = new Error(`You are not allowed to ${action} data from /sportEvents/${req.params.sportEventId}.`);
        error.status = 403;
        error.title = "Not allowed";
        error.instance = `${req.method} ${req.originalUrl}`;
        return next(error);
      })
      .catch((err) => next(err));    
  };
};

exports.isAllowedToCreateSportEvents = (req, res, next) => {
  const permission = rolePermissions.can(req.user.role.name.toLowerCase()).createAny("sportEvents");
  if (permission.granted) {
    req.permission = permission;
    return next();
  }
  const error = new Error("You are not allowed to create new sportEvents.");
  error.status = 403;
  error.title = "Not allowed";
  error.instance = `${req.method} ${req.originalUrl}`;
  return next(error);
};