"use strict"

const express = require("express");
const cors = require("./cors");
const countryController = require("../controllers/countryController");
const authMiddleware = require("../middlewares/auth");
const countryRouter = express.Router();
countryRouter.use(express.json());

countryRouter
  .route("/api/v1/countries", countryController.index)
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, countryController.getAllCountries)
  .post(cors.corsWithOptions, authMiddleware.isLoggedIn, countryController.createCountry)
  .put(cors.corsWithOptions, authMiddleware.isLoggedIn, countryController.updateCountry) //Not supported
  .delete(cors.corsWithOptions, authMiddleware.isLoggedIn, countryController.deleteCountries); //Not supported

countryRouter
  .route("/api/v1/countries/:countryId")
  .get(cors.cors, countryController.getCountryById)
  .post(cors.corsWithOptions, authMiddleware.isLoggedIn, countryController.createCountryWithId) //Not supported
  .put(cors.corsWithOptions, authMiddleware.isLoggedIn, countryController.updateCountryById)
  .delete(cors.corsWithOptions, authMiddleware.isLoggedIn, countryController.deleteCountryById);

module.exports = countryRouter;