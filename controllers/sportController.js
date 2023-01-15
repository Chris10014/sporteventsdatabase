"use strict";
const Sports = require("../models/sports");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Sports
exports.getAllSports = ((req,res, next) => {
    Sports.findAll({ where: req.query })
      .then(
        (sports) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(sports);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new Sport 
exports.createSport = ((req, res, next) => {
  if(!Object.keys(req.body).length) {
    console.log("empty request", req.body);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send("Data is missing.");
    return;
  }
    Sports.create(req.body)
      .then(
        (sport) => {
          console.log("Sport created: ", sport);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(sport);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//update one Sport
exports.updateSport = ((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /sports");
});

//delete Sports
exports.deleteSports = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.statusCode = 403;
    res.end("Delete is not supported on /sports.");
  }
  res.statusCode = 403;
  res.end("Delete is not supported on /sports.");
};

//get one Sport by Id
exports.getSportById = ((req, res, next) => {
    Sports.findByPk(req.params.sportId)
      .then((sport) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(sport);
      })
      .catch((err) => next(err));
});

//create a sport with an Id
exports.createSportWithId = (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /sports/:sportId");
};

//update one sport by Id 
exports.updateSportById = (req, res, next) => {
  let sportId = req.params.sportId;

  Sports.findByPk(sportId).then((sport) => {
    if (!sport) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Sport with Id ${sportId} found.`);
      return;
    }
    sport
      .update(req.body)
      .then(
        (sport) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(sport);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
};

//delete a sport by Id
exports.deleteSportById = (req, res, next) => {
  let sportId = req.params.sportId;

  Sports.findByPk(sportId).then((sport) => {
    if (!sport) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Sport with Id ${sportId} found.`);
      return;
    }
    sport.destroy();
    console.log(`Sport with id ${sportId} deleted.`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(`Sport with Id ${sportId} deleted.`);
  });
};