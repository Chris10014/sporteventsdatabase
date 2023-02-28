"use strict";

const Courses = require("../../models/courses");
const SportEvents = require("../../models/sportEvents");
const Races = require("../../models/races");
const { rolePermissions } = require("../../permissions/rolePermissions");

//Resource /courses
/** Checks the allowed actions for a user on the resource /courses
 * @params {string} action - one of the CRUD actions create || read || update || delete
 * 
 * @returns {Object} req.permission
 */
exports.isAllowedToHandleCoursesById = (action) => {
  const actionAny = action + "Any";
  const actionOwn = action + "Own";

  return (req, res, next) => {
    //retrieve eventDate with sportEvent
    Courses.findByPk(req.params.courseId, { include: [ { model: Races, include: [ {model: SportEvents}]}] })
      .then((course) => {
        //find out if user is owner of the related event ...
        const ownerId = course.race.sportEvent.owner_id;
        const permission = req.user.id * 1 == ownerId * 1 
        ? rolePermissions.can(req.user.role.name.toLowerCase())[actionOwn]("courses") 
        : rolePermissions.can(req.user.role.name.toLowerCase())[actionAny]("courses");
        if (permission.granted) {
          req.permission = permission;
          return next();
        }
        const error = new Error(`You are not allowed to ${action} data from /courses/${req.params.courseId}. It belongs to sportEvent "${course.race.sportEvent.name}" and you are not the owner of it.`);
        error.status = 403;
        error.title = "Not allowed";
        error.instance = `${req.method} ${req.originalUrl}`;
        return next(error);
      })
      .catch((err) => next(err));
  };
};
 /**
  * eventOwners can create courses belonging to their sportEvents.
  * editor and admins can create courses at all.
  * @param {*} req 
  * @param {*} res 
  * @param {*} next 
  */
exports.isAllowedToCreateCourses = (req, res, next) => {
    Races.findByPk(req.body.race_id, { include:[{ model: SportEvents }]})
    .then((race) => {
      //find out if user is owner of the related event.
      console.log("Race: ", race)
      const ownerId = race.sportEvent.owner_id;
      const permission = req.user.id * 1 == ownerId * 1 ? rolePermissions.can(req.user.role.name.toLowerCase()).createOwn("courses") : rolePermissions.can(req.user.role.name.toLowerCase()).createAny("courses");
      if (permission.granted) {
        req.permission = permission;
        return next();
      }
      const error = new Error("You are not allowed to create new courses. Or at least you are not allowed to create courses for other sportEvents than owned by you.");
      error.status = 403;
      error.title = "Not allowed";
      error.instance = `${req.method} ${req.originalUrl}`;
      return next(error);
    });
};