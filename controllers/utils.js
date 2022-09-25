
"use strict";

const crypto = require("crypto"); //used to create activationToken
const { json } = require("express");
const variables = require("../config/variables");
const mailer = require("../services/mailer");

//Create the activation token exists of a 32 hex string and a timestamp in seconds dated some time ahead with . as separator
exports.createActivationToken = () => `${crypto.randomBytes(32).toString("hex")}.${Math.round(new Date().getTime()/1000) + variables.activation_link_expiring_time*1}`; //in seconds; *1 to force a mathematical operation