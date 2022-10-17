"use strict"

const express = require("express");
const countryController = require("../controllers/countryController");
const authMiddleware = require("../middlewares/auth");
const countryRouter = express.Router();
countryRouter.use(express.json());

countryRouter
  .route("/api/v1/countries", countryController.index)
  .get(countryController.getAllCountries)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole(["admin", "superAdmin"]), countryController.createCountry)
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole(["admin", "superAdmin"]), countryController.updateCountry) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole(["admin", "superAdmin"]), countryController.deleteCountries); //Not supported

countryRouter
  .route("/api/v1/countries/:countryId")
  .get(countryController.getCountryById)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole(["admin", "superAdmin"]), countryController.createCountryWithId) //Not supported
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole(["admin", "superAdmin"]), countryController.updateCountryById)
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole(["admin", "superAdmin"]), countryController.deleteCountryById);

module.exports = countryRouter;