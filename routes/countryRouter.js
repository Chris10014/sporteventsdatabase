"use strict"

const express = require("express");
const countryController = require("../controllers/countryController");
const countryRouter = express.Router();
countryRouter.use(express.json());

countryRouter
  .route("/api/v1/countries", countryController.index)
  .get(countryController.getAllCountries)
  .post(countryController.createCountry)
  .put(countryController.updateCountry)
  .delete(countryController.deleteCountries);

countryRouter
  .route("/api/v1/countries/:countryId")
  .get(countryController.getCountryById)
  .post(countryController.createCountryWithId)
  .put(countryController.updateCountryById)
  .delete(countryController.deleteCountryById);

module.exports = countryRouter;