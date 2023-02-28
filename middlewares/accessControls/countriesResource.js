"use strict";

const countries = require("../../models/countries");
const { rolePermissions } = require("../../permissions/rolePermissions");

//Resource /countries
/**
 * Checks the allowed actions for a user on the resource /countries
 * @params {string} action - one of the CRUD actions create || read || update || delete
 * 
 * @returns {Object} req.permission
 */
exports.isAllowedToHandlecountriesById = (action) => {
  const actionAny = action + "Any";
  const actionOwn = action + "Own";

  return (req, res, next) => {

    //retrieve country
    countries.findByPk(req.params.countryId)
      .then((country) => {
        const ownerId = country.owner_id;
        const permission = req.user.id*1 == ownerId*1 
        ? rolePermissions.can(req.user.role.name.toLowerCase())[actionOwn]("countries") 
        : rolePermissions.can(req.user.role.name.toLowerCase())[actionAny]("countries");
        if (permission.granted) {
          req.permission = permission;
          return next();          
        }
        const error = new Error(`You are not allowed to ${action} data from /countries/${req.params.countryId}.`);
        error.status = 403;
        error.title = "Not allowed";
        error.instance = `${req.method} ${req.originalUrl}`;
        return next(error);
      })
      .catch((err) => next(err));    
  };
};

exports.isAllowedToCreateCountries = (req, res, next) => {
  const permission = rolePermissions.can(req.user.role.name.toLowerCase()).createAny("countries");
  if (permission.granted) {
    req.permission = permission;
    return next();
  }
  const error = new Error("You are not allowed to create new countries.");
  error.status = 403;
  error.title = "Not allowed";
  error.instance = `${req.method} ${req.originalUrl}`;
  return next(error);
};