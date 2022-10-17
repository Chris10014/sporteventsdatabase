"use strict"

const express = require("express");
const sportEventController = require("../controllers/sportEventController");
const { hasRole } = require("../middlewares/auth");
const sportEventRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
sportEventRouter.use(express.json());

sportEventRouter
  .route("/api/v1/sportEvents", sportEventController.index)
  .get(sportEventController.getAllSportEvents)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), sportEventController.createSportEvent)
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), sportEventController.updateSportEvent) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), sportEventController.deleteSportEvents);//Not supported

sportEventRouter
  .route("/api/v1/sportEvents/:sportEventId")
  .get(sportEventController.getSportEventById)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), sportEventController.createSportEventWithId) //Not supported
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), sportEventController.updateSportEventById)
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), sportEventController.deleteSportEventById);

module.exports = sportEventRouter;