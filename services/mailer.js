const nodemailer = require("nodemailer");
const variables = require("../config/variables");

exports.transport = nodemailer.createTransport({
  host: variables.mailserver.host,
  port: variables.mailserver.port,
  auth: {
    user: variables.mailserver.user,
    pass: variables.mailserver.password
  },
});
