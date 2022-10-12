"use strict";
/**
 * to automatically format code: CTR + K + F or CTR + K + D
 */

const http = require("http");
const path = require("path"); //Modul um Pfadangaben zu generieren
/**
 * Beispiel zur Verwendung von path() um den Pfad zu einem directory zu bekommen
 * const configDirectory = path.join(__dirname, "config") // Output: D:\03_dev\sporteventsserver\config
 */ 
const sequelize = require("./services/database");
const express = require("express");
const logger = require("morgan");

const countryRouter = require("./routes/countryRouter");
const teamRouter = require("./routes/teamRouter");
const userRouter = require("./routes/userRouter");
const roleRouter = require("./routes/roleRouter");
const authRouter = require("./routes/authRouter");
const sportRouter = require("./routes/sportRouter");
const sportEventRouter = require("./routes/sportEventRouter");
const eventDateRouter = require("./routes/eventDateRouter");
const raceRouter = require("./routes/raceRouter");
const courseRouter = require("./routes/courseRouter");
const sendMailRouter = require("./routes/sendMailRouter");
const authMiddleware = require("./middlewares/auth");

// sequelize.sync({ alter: true })
//   .then((result) => {
//     console.log("Countries table created. ", result);
//   })
//   .catch((err) => {
//     console.log("Error creating countries table: ", err);
//   });

const app = express();

const variables = require("./config/variables"); //Bezieht die Umgebungsvariablen aus variables Objekt
const { sendConfirmationMail } = require("./controllers/sendMailController");

const port = variables.port;

app.use(logger("dev")); //Logs all requests to console

app.use(authRouter);
app.use(userRouter);

app.use(authMiddleware.isLoggedIn);

app.use(roleRouter);
app.use(countryRouter);
app.use(teamRouter);
app.use(sportRouter);
app.use(sportEventRouter);
app.use(eventDateRouter);
app.use(raceRouter);
app.use(courseRouter);
app.use(sendMailRouter);

app.listen(port, () => {
  console.log(`sportEventsServer app listening on port ${port}`);
});

// catch 404 and forward to error handler
app.use((req, res, next)  => {
  const error = new Error("Resource not found. Please check your request url.")
  error.status(404);
  error.title = "Not found";
  next(error);
});

app.use((error, req, res , next) => {

  res.status(error.status || 500);
  error.details = error.message || "Something went wrong";
  error.title = error.title || "Error";
  res.json({error: error })
   console.log("\nFrom error handler: ", error + "\n");
   return;
});
