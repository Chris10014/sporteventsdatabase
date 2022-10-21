"use strict"

const express = require("express");
const eventDateController = require("../controllers/eventDateController");
const authMiddleware = require("../middlewares/auth");
const eventDateRouter = express.Router();
eventDateRouter.use(express.json());

eventDateRouter
  .route("/api/v1/eventDates", eventDateController.index)
  .get(eventDateController.getAllEventDates)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), eventDateController.createEventDate)
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), eventDateController.updateEventDate) //Not supported
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), eventDateController.deleteEventDates); //Not supported

eventDateRouter
  .route("/api/v1/eventDates/:eventDateId")
  .get(eventDateController.getEventDateById)
  .post(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), eventDateController.createEventDateWithId) //Not supported
  .put(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), eventDateController.updateEventDateById)
  .delete(authMiddleware.isLoggedIn, authMiddleware.hasRole("editor"), eventDateController.deleteEventDateById);

module.exports = eventDateRouter;