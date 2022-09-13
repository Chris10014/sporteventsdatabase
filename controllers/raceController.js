const Races = require("../models/races");
const SportEvents = require("../models/sportEvents");
const Sports = require("../models/sports");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Races
exports.getAllRaces = ((req,res, next) => {
    Races.findAll({ where: req.query, 
      include: [
      { model: SportEvents},
      { model: Sports, attributes: { exclude: [ "created_at", "updated_at" ]}}
      ]})
      .then(
        (races) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(races);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new Race 
exports.createRace = ((req, res, next) => {
  if(!Object.keys(req.body).length) {
    console.log("empty request", req.body);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send("Data is missing.");
    return;
  }
    Races.create(req.body)
      .then(
        (race) => {
          console.log("Race created: ", race);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(race);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//update one Race
exports.updateRace = ((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /races");
});

//delete Races
exports.deleteRaces = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.statusCode = 403;
    res.end("Delete is not supported on /races.");
  }
  res.statusCode = 403;
  res.end("Delete is not supported on /races.");
};

//get one Race by Id
exports.getRaceById = ((req, res, next) => {
    Races.findByPk(req.params.raceId, { include: Countries })
      .then((race) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(race);
      })
      .catch((err) => next(err));
});

//create a race with an Id
exports.createRaceWithId = (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /races/:raceId");
};

//update one race by Id 
exports.updateRaceById = (req, res, next) => {
  let raceId = req.params.raceId;

  Races.findByPk(raceId).then((race) => {
    if (!race) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Race with Id ${raceId} found.`);
      return;
    }
    race
      .update(req.body)
      .then(
        (race) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(race);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
};

//delete a race by Id
exports.deleteRaceById = (req, res, next) => {
  let raceId = req.params.raceId;

  Races.findByPk(raceId).then((race) => {
    if (!race) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Race with Id ${raceId} found.`);
      return;
    }
    race.destroy();
    console.log(`Race with id ${raceId} deleted.`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(`Race with Id ${raceId} deleted.`);
  });
};