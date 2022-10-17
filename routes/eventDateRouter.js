"use strict"

const express = require("express");
const eventDateController = require("../controllers/eventDateController");
const authMiddleware = require("../middlewares/auth");
const eventDateRouter = express.Router();
eventDateRouter.use(express.json());

eventDateRouter
  .route("/api/v1/eventDates", eventDateController.index)
  .get(eventDateController.getAllEventDates)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), eventDateController.createEventDate)
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), eventDateController.updateEventDate) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), eventDateController.deleteEventDates); //Not supported

eventDateRouter
  .route("/api/v1/eventDates/:eventDateId")
  .get(eventDateController.getEventDateById)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), eventDateController.createEventDateWithId) //Not supported
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), eventDateController.updateEventDateById)
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole(["superAdmin", "admin", "editor"]), eventDateController.deleteEventDateById);

module.exports = eventDateRouter;