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
      include: {
        model: SportEvents,
        attributes: ["created_at", "updated_at"], // { exclude: ["created_at"] }
      },
      order: ["id", "DESC"],
    })
      .then(
        (eventDates) => {
          res.status(200).json(eventDates);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new EventDate 
exports.createEventDate = ((req, res, next) => {
  if(!Object.keys(req.body).length) {
    console.log("empty request", req.body);
    res.status(400).json({success: false, status: "Empty object", error: "Data is missing."});
    return;
  }
    EventDates.create(req.body)
      .then(
        (eventDate) => {
          console.log("EventDate created: ", eventDate);
          res.status(200).json(eventDate);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//update one EventDate
exports.updateEventDate = ((req, res, next) => {
    res.status(400).json({ success: false, status: "Unsupported action", message: "PUT operation not supported on /eventDates" });
});

//delete EventDates
exports.deleteEventDates = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.status(400).json({ success: false, status: "Unsupported action", message: "Delete is not supported on /eventDates." });
  }
  res.status(400).json({ success: false, status: "Unsupported action", message: "Delete is not supported on /eventDates." });
};

//get one EventDate by Id
exports.getEventDateById = ((req, res, next) => {
    EventDates.findByPk(req.params.eventDateId)
      .then((eventDate) => {
        res.status(200).json(eventDate);
      })
      .catch((err) => next(err));
});

//create a eventDate with an Id
exports.createEventDateWithId = (req, res, next) => {
  res.status(400).json({ success: false, status: "Unsupported action", message: "PUT operation not supported on /eventDates/:eventDateId" });
};

//update one eventDate by Id 
exports.updateEventDateById = (req, res, next) => {
  let eventDateId = req.params.eventDateId;

  EventDates.findByPk(eventDateId).then((eventDate) => {
    if (!eventDate) {
      res.status(200).json({ message: `No EventDate with Id ${eventDateId} found.` });
      return;
    }
    eventDate
      .update(req.body)
      .then(
        (eventDate) => {
          res.status(200).json(eventDate);
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
      res.status(200).json({ success: true, message: `No EventDate with Id ${eventDateId} found.` });
      return;
    }
    eventDate.destroy();
    res.status(200).json({ success: true, message: `EventDate with Id ${eventDateId} deleted.` });
  });
};