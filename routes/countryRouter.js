"use strict"

const express = require("express");
const Countries = require("../models/countries");
const countryRouter = express.Router();
countryRouter.use(express.json());

countryRouter
  .route("/api/v1/countries", (res, req) => {
    res.sendStatus(200);
  })
  .get((req, res, next) => {
    Countries.findAll({ where: req.query })
      .then(
        (countries) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(countries);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Countries.create(req.body)
    .then((country) => {
      console.log ("Country created: ", country);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(country);
      }, (err) => next(err)
    )
    .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /countries");
  })
  .delete((req, res, next) => {
    if (Object.entries(req.query).length == 0) {
      res.statusCode = 403;
      res.end("Delete is not supported on /countries.");
    }
    res.statusCode = 403;
    res.end("Delete is not supported on /countries.");
  });

countryRouter
  .route("/api/v1/countries/:countryId")
  .get((req, res, next) => {
    Countries.findByPk(req.params.countryId)
      .then((country) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(country);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /countries/:countryId");
  })
  .put((req, res, next) => {
    let countryId = req.params.countryId;

    Countries.findByPk(countryId).then((country) => {
      if (!country) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send(`No Country with Id ${countryId} found.`);
        return;
      }
      country
        .update(req.body)
        .then(
          (country) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(country);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    });
  })
  .delete((req, res, next) => {
    let countryId = req.params.countryId;

    Countries.findByPk(countryId).then((country) => {
      if (!country) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send(`No Country with Id ${countryId} found.`);
        return;
      }
      country.destroy();
      console.log(`Country with id ${countryId} deleted.`);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`Country with Id ${countryId} deleted.`);
    });
  });

module.exports = countryRouter;