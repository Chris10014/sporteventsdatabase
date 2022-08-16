"use strict";

const http = require("http");
const path = require("path"); //Modul um Pfadangaben zu generieren
/**
 * Beispiel zur Verwendung von path() um den Pfad zu einem directory zu bekommen
 * const configDirectory = path.join(__dirname, "config") // Output: D:\03_dev\sporteventsserver\config
 */ 
const sequelize = require("./services/database");
const express = require("express");
const countryRouter = require("./routes/countryRouter");

//const Countries = require("./models/countries");
sequelize.sync({ alter: true })
  .then((result) => {
    console.log("Countries table created. ", result);
  })
  .catch((err) => {
    console.log("Error creating countries table: ", err);
  });

const app = express();

const variables = require("./config/variables"); //Bezieht die Umgebungsvariablen aus variables Objekt

const port = variables.port;

app.use(countryRouter);

app.listen(port, () => {
  console.log(`sportEventsServer app listening on port ${port}`);
});
