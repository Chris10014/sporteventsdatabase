"use strict";

const SportEvents = require("../../models/sportEvents");
const Races = require("../../models/races");
const { rolePermissions } = require("../../permissions/rolePermissions");

//Resource /races
/** Checks the allowed actions for a user on the resource /races
 * @params {string} action - one of the CRUD actions create || read || update || delete
 * 
 * @returns {Object} req.permission
 */
exports.isAllowedToHandleRacesById = (action) => {
  const actionAny = action + "Any";
  const actionOwn = action + "Own";

  return (req, res, next) => {
    //retrieve eventDate with sportEvent
    Races.findByPk(req.params.raceId, { include: SportEvents })
      .then((race) => {
        //find out if user is owner of the related event ...
        console.log("race: ", race.sportEvent)
        const ownerId = race.sportEvent.owner_id;
        const permission = req.user.id * 1 == ownerId * 1 
        ? rolePermissions.can(req.user.role.name.toLowerCase())[actionOwn]("races") 
        : rolePermissions.can(req.user.role.name.toLowerCase())[actionAny]("races");
        if (permission.granted) {
          req.permission = permission;
          return next();
        }
        const error = new Error(`You are not allowed to ${action} data from /races/${req.params.raceId}. It belongs to sportEvent "${race.sportEvent.name}" and you are not the owner of it.`);
        error.status = 403;
        error.title = "Not allowed";
        error.instance = `${req.method} ${req.originalUrl}`;
        return next(error);
      })
      .catch((err) => next(err));
  };
};
 /**
  * eventOwners can create races belonging to their sportEvents.
  * editor and admins can create races at all.
  * @param {*} req 
  * @param {*} res 
  * @param {*} next 
  */
exports.isAllowedToCreateRaces = (req, res, next) => {
    SportEvents.findByPk(req.body.sportEvent_id)
      .then((sportEvent) => {
        //find out if user is owner of the related event.
        const ownerId = sportEvent.owner_id;
        const permission = req.user.id * 1 == ownerId * 1 
        ? rolePermissions.can(req.user.role.name.toLowerCase()).createOwn("races") 
        : rolePermissions.can(req.user.role.name.toLowerCase()).createAny("races");
  if (permission.granted) {
    req.permission = permission;
    return next();
  }
  const error = new Error("You are not allowed to create new races. Or at least you are not allowed to create races for other sportEvents than owned by you.");
  error.status = 403;
  error.title = "Not allowed";
  error.instance = `${req.method} ${req.originalUrl}`;
  return next(error);
})
};