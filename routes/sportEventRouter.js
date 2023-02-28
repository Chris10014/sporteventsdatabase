"use strict"

const express = require("express");
const cors = require("./cors");
const sportEventController = require("../controllers/sportEventController");
const { hasRole } = require("../middlewares/auth");
const { isAllowedToCreateSportEvents, isAllowedToHandleSportEventsById } = require("../middlewares/accessControls/sportEventsResource");
const sportEventRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
sportEventRouter.use(express.json());

sportEventRouter
  .route("/api/v1/sportEvents", sportEventController.index)
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, sportEventController.getAllSportEvents)
  .post(cors.corsWithOptions, authMiddleware.isLoggedIn, isAllowedToCreateSportEvents, sportEventController.createSportEvent)
  .put(cors.corsWithOptions, authMiddleware.isLoggedIn, sportEventController.updateSportEvent) //Not supported
  .delete(cors.corsWithOptions, authMiddleware.isLoggedIn, sportEventController.deleteSportEvents);//Not supported

sportEventRouter
  .route("/api/v1/sportEvents/:sportEventId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, sportEventController.getSportEventById)
  .post(cors.corsWithOptions, authMiddleware.isLoggedIn, isAllowedToCreateSportEvents, sportEventController.createSportEventWithId) //Not supported
  .put(cors.corsWithOptions, authMiddleware.isLoggedIn, isAllowedToHandleSportEventsById("update"), sportEventController.updateSportEventById)
  .delete(cors.corsWithOptions, authMiddleware.isLoggedIn, isAllowedToHandleSportEventsById("delete"), sportEventController.deleteSportEventById);

module.exports = sportEventRouter;