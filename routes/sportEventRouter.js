"use strict"

const express = require("express");
const sportEventController = require("../controllers/sportEventController");
const sportEventRouter = express.Router();
sportEventRouter.use(express.json());

sportEventRouter
  .route("/api/v1/sportEvents", sportEventController.index)
  .get(sportEventController.getAllSportEvents)
  .post(sportEventController.createSportEvent)
  .put(sportEventController.updateSportEvent)
  .delete(sportEventController.deleteSportEvents);

sportEventRouter
  .route("/api/v1/sportEvents/:sportEventId")
  .get(sportEventController.getSportEventById)
  .post(sportEventController.createSportEventWithId)
  .put(sportEventController.updateSportEventById)
  .delete(sportEventController.deleteSportEventById);

module.exports = sportEventRouter;