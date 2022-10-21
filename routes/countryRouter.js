"use strict"

const express = require("express");
const countryController = require("../controllers/countryController");
const authMiddleware = require("../middlewares/auth");
const countryRouter = express.Router();
countryRouter.use(express.json());

countryRouter
  .route("/api/v1/countries", countryController.index)
  .get(countryController.getAllCountries)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole("admin"), countryController.createCountry)
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole("admin"), countryController.updateCountry) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("admin"), countryController.deleteCountries); //Not supported

countryRouter
  .route("/api/v1/countries/:countryId")
  .get(countryController.getCountryById)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole("admin"), countryController.createCountryWithId) //Not supported
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole("admin"), countryController.updateCountryById)
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("admin"), countryController.deleteCountryById);

module.exports = countryRouter;