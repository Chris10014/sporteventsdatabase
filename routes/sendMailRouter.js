"use strict"

const express = require("express");
const sendMailController = require("../controllers/sendMailController");
const userMiddleware = require("../middlewares/dataInputValidation.js");
const sendMailRouter = express.Router();
sendMailRouter.use(express.json());

sendMailRouter
  .post("/api/v1/sendActivationMail",  sendMailController.sendActivationMail)

module.exports = sendMailRouter;