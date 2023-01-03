"use strict";

const EventDates = require("../../models/eventDates");
const SportEvents = require("../../models/sportEvents");
const { roles } = require("../../permissions/rolePermissions");

//Resource /eventDates
/** Checks the allowed actions for a user on the resource /users
 * @params {string} action - one of the CRUD actions create || read || update || delete
 * 
 * @returns {Object} req.permission
 */
exports.isAllowedToHandleEventDatesById = (action) => {
  const actionAny = action + "Any";
  const actionOwn = action + "Own";

  return (req, res, next) => {
    //retrieve eventDate with sportEvent
    EventDates.findByPk(req.params.eventDateId, { include: SportEvents })
      .then((eventDate) => {
        //find out if user is owner of the related event ...
        console.log("sE: ", eventDate)
        const ownerId = eventDate.sportEvent.owner_id;
        const permission = req.user.id * 1 == ownerId * 1 
        ? roles.can(req.user.role.name.toLowerCase())[actionOwn]("eventDates") 
        : roles.can(req.user.role.name.toLowerCase())[actionAny]("eventDates");
        if (permission.granted) {
          req.permission = permission;
          return next();
        }
        const error = new Error(`You are not allowed to ${action} data from /eventDates/${req.params.eventDateId}. It belongs to sportEvent "${eventDate.sportEvent.name}" and you are not the owner of it.`);
        error.status = 403;
        error.title = "Not allowed";
        error.instance = `${req.method} ${req.originalUrl}`;
        return next(error);
      })
      .catch((err) => next(err));
  };
};
 /**
  * eventOwners can CRUD only eventDates belonging to their events.
  * editor and admins can CRUD eventDates at all.
  * @param {*} req 
  * @param {*} res 
  * @param {*} next 
  */
exports.isAllowedToCreateEventDates = (req, res, next) => {
    SportEvents.findByPk(req.body.sportEvent_id)
      .then((sportEvent) => {
        //find out if user is owner of the related event.
        const ownerId = sportEvent.owner_id;
        const permission = req.user.id * 1 == ownerId * 1 
        ? roles.can(req.user.role.name.toLowerCase()).createOwn("eventDates") 
        : roles.can(req.user.role.name.toLowerCase()).createAny("eventDates");
  if (permission.granted) {
    req.permission = permission;
    return next();
  }
  const error = new Error("You are not allowed to create new eventDates. Or at least you are not allowed to create evenDates for other sportEvents than owned by you.");
  error.status = 403;
  error.title = "Not allowed";
  error.instance = `${req.method} ${req.originalUrl}`;
  return next(error);
})
};