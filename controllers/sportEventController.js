const SportEvents = require("../models/sportEvents");
const Countries = require("../models/countries");
const Teams = require("../models/teams");
const Users = require("../models/users");
const EventDates = require("../models/eventDates");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all SportEvents
exports.getAllSportEvents = ((req,res, next) => {
    SportEvents.findAll({ where: req.query, include: [
      Countries, 
      EventDates,
      { model: Teams, as: "host"}, 
      { model: Users, as: "owner"}
    ] })
      .then(
        (sportEvents) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(sportEvents);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new SportEvent 
exports.createSportEvent = ((req, res, next) => {
  if(!Object.keys(req.body).length) {
    console.log("empty request", req.body);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send("Data is missing.");
    return;
  }
    SportEvents.create(req.body)
      .then(
        (sportEvent) => {
          console.log("SportEvent created: ", sportEvent);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(sportEvent);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//update one SportEvent
exports.updateSportEvent = ((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /sportEvents");
});

//delete SportEvents
exports.deleteSportEvents = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.statusCode = 403;
    res.end("Delete is not supported on /sportEvents.");
  }
  res.statusCode = 403;
  res.end("Delete is not supported on /sportEvents.");
};

//get one SportEvent by Id
exports.getSportEventById = ((req, res, next) => {
    SportEvents.findByPk(req.params.sportEventId, { include: Countries })
      .then((sportEvent) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(sportEvent);
      })
      .catch((err) => next(err));
});

//create a sportEvent with an Id
exports.createSportEventWithId = (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /sportEvents/:sportEventId");
};

//update one sportEvent by Id 
exports.updateSportEventById = (req, res, next) => {
  let sportEventId = req.params.sportEventId;

  SportEvents.findByPk(sportEventId).then((sportEvent) => {
    if (!sportEvent) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No SportEvent with Id ${sportEventId} found.`);
      return;
    }
    sportEvent
      .update(req.body)
      .then(
        (sportEvent) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(sportEvent);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
};

//delete a sportEvent by Id
exports.deleteSportEventById = (req, res, next) => {
  let sportEventId = req.params.sportEventId;

  SportEvents.findByPk(sportEventId).then((sportEvent) => {
    if (!sportEvent) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No SportEvent with Id ${sportEventId} found.`);
      return;
    }
    sportEvent.destroy();
    console.log(`SportEvent with id ${sportEventId} deleted.`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(`SportEvent with Id ${sportEventId} deleted.`);
  });
};