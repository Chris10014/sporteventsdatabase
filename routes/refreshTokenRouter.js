"use strict"

const express = require("express");
const refreshTokenController = require("../controllers/refreshTokenController");
const refreshTokenRouter = express.Router();
refreshTokenRouter.use(express.json());

refreshTokenRouter
  .get("/api/v1/refresh",  refreshTokenController.handleRefreshToken)

module.exports = refreshTokenRouter;