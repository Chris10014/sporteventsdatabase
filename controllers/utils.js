"use strict";

const crypto = require("crypto"); //used to create activationToken
const { json } = require("express");
const variables = require("../config/variables");
const Users = require("../models/users");
const Teams = require("../models/teams");

//Creates the activation token exists of a 32 hex string and a timestamp in seconds dated some time ahead with . as separator
exports.createActivationToken = () => `${crypto.randomBytes(32).toString("hex")}.${Math.round(new Date().getTime() / 1000) + variables.activation_link_expiring_time * 1}`; //in seconds; *1 to force a mathematical operation

/**
 * Determine the number of team members of a specific team
 * @param {integer} teamId
 *
 * @return {integer} numberOfTeamMembers as Promise
 */
exports.getNumberOfTeamMembers = (teamId) => {
  return new Promise((resolve, reject) => {
    console.log("get# ...: start: ", teamId);
    Users.count({
      include: [
        {
          model: Teams,
          where: { id: teamId },
          through: { where: { admitted: true } },
        },
      ],
    })
      .then((numberOfTeamMembers) => {
        console.log("#teamMembers: ", numberOfTeamMembers);
        console.log("get# ...: end: ", teamId);
        resolve(numberOfTeamMembers);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
