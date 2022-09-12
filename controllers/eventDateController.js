const EventDates = require("../models/eventDates");
const SportEvents = require("../models/sportEvents");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all EventDates
exports.getAllEventDates = ((req,res, next) => {
    EventDates.findAll({ 
      where: req.query,
      include: SportEvents    
    })
      .then(
        (eventDates) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(eventDates);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new EventDate 
exports.createEventDate = ((req, res, next) => {
  if(!Object.keys(req.body).length) {
    console.log("empty request", req.body);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send("Data is missing.");
    return;
  }
    EventDates.create(req.body)
      .then(
        (eventDate) => {
          console.log("EventDate created: ", eventDate);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(eventDate);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//update one EventDate
exports.updateEventDate = ((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /eventDates");
});

//delete EventDates
exports.deleteEventDates = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.statusCode = 403;
    res.end("Delete is not supported on /eventDates.");
  }
  res.statusCode = 403;
  res.end("Delete is not supported on /eventDates.");
};

//get one EventDate by Id
exports.getEventDateById = ((req, res, next) => {
    EventDates.findByPk(req.params.eventDateId)
      .then((eventDate) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(eventDate);
      })
      .catch((err) => next(err));
});

//create a eventDate with an Id
exports.createEventDateWithId = (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /eventDates/:eventDateId");
};

//update one eventDate by Id 
exports.updateEventDateById = (req, res, next) => {
  let eventDateId = req.params.eventDateId;

  EventDates.findByPk(eventDateId).then((eventDate) => {
    if (!eventDate) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No EventDate with Id ${eventDateId} found.`);
      return;
    }
    eventDate
      .update(req.body)
      .then(
        (eventDate) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(eventDate);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
};

//delete a eventDate by Id
exports.deleteEventDateById = (req, res, next) => {
  let eventDateId = req.params.eventDateId;

  EventDates.findByPk(eventDateId).then((eventDate) => {
    if (!eventDate) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No EventDate with Id ${eventDateId} found.`);
      return;
    }
    eventDate.destroy();
    console.log(`EventDate with id ${eventDateId} deleted.`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(`EventDate with Id ${eventDateId} deleted.`);
  });
};