"use strict"

const express = require("express");
const eventDateController = require("../controllers/eventDateController");
const eventDateRouter = express.Router();
eventDateRouter.use(express.json());

eventDateRouter
  .route("/api/v1/eventDates", eventDateController.index)
  .get(eventDateController.getAllEventDates)
  .post(eventDateController.createEventDate)
  .put(eventDateController.updateEventDate)
  .delete(eventDateController.deleteEventDates);

eventDateRouter
  .route("/api/v1/eventDates/:eventDateId")
  .get(eventDateController.getEventDateById)
  .post(eventDateController.createEventDateWithId)
  .put(eventDateController.updateEventDateById)
  .delete(eventDateController.deleteEventDateById);

module.exports = eventDateRouter;