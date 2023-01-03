"use strict"

const express = require("express");
const sportEventController = require("../controllers/sportEventController");
const { hasRole } = require("../middlewares/auth");
const { isAllowedToCreateSportEvents, isAllowedToHandleSportEventsById } = require("../middlewares/accessControls/sportEventsResource");
const sportEventRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
sportEventRouter.use(express.json());

sportEventRouter
  .route("/api/v1/sportEvents", sportEventController.index)
  .get(sportEventController.getAllSportEvents)
  .post(authMiddleware.isLoggedIn, isAllowedToCreateSportEvents, sportEventController.createSportEvent)
  .put(authMiddleware.isLoggedIn, sportEventController.updateSportEvent) //Not supported
  .delete(authMiddleware.isLoggedIn, sportEventController.deleteSportEvents);//Not supported

sportEventRouter
  .route("/api/v1/sportEvents/:sportEventId")
  .get(sportEventController.getSportEventById)
  .post(authMiddleware.isLoggedIn, isAllowedToCreateSportEvents, sportEventController.createSportEventWithId) //Not supported
  .put(authMiddleware.isLoggedIn, isAllowedToHandleSportEventsById("update"), sportEventController.updateSportEventById)
  .delete(authMiddleware.isLoggedIn, isAllowedToHandleSportEventsById("delete"), sportEventController.deleteSportEventById);

module.exports = sportEventRouter;