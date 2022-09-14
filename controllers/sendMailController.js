"use strict";

const mailer = require("../services/mailer");

//index
exports.index = (req, res, next) => {
  res.sendStatus(200);
};

//send an confirmation mail
exports.sendConfirmationMail = (req, res, next) => {
  const { to, subject, text, html } = req.body;
  const mailData = {
    from: "chrisoph@test.de",
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  mailer.transport.sendMail(mailData, (err, info) => {
    if (err) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Mail not send", messageId: null, error: err });
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, status: "Mail send", messageId: info.messageId, error: null });
    return;
  });
};
