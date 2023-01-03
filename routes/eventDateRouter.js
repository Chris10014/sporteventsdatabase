"use strict"

const express = require("express");
const eventDateController = require("../controllers/eventDateController");
const authMiddleware = require("../middlewares/auth");
const { isAllowedToCreateEventDates, isAllowedToHandleEventDatesById } = require("../middlewares/accessControls/eventDatesResource");
const eventDateRouter = express.Router();
eventDateRouter.use(express.json());

eventDateRouter
  .route("/api/v1/eventDates", eventDateController.index)
  .get(eventDateController.getAllEventDates)
  .post(authMiddleware.isLoggedIn, isAllowedToCreateEventDates, eventDateController.createEventDate)
  .put(authMiddleware.isLoggedIn, eventDateController.updateEventDate) //Not supported
  .delete(authMiddleware.isLoggedIn, eventDateController.deleteEventDates); //Not supported

eventDateRouter
  .route("/api/v1/eventDates/:eventDateId")
  .get(eventDateController.getEventDateById)
  .post(authMiddleware.isLoggedIn, eventDateController.createEventDateWithId) //Not supported
  .put(authMiddleware.isLoggedIn, isAllowedToHandleEventDatesById("update"), eventDateController.updateEventDateById)
  .delete(authMiddleware.isLoggedIn, isAllowedToHandleEventDatesById("delete"), eventDateController.deleteEventDateById);

module.exports = eventDateRouter;