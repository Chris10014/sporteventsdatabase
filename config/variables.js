/**
 * Schreibt Umgebungsvariablen aus .env File in das Objekt variables
 */
require("dotenv").config() //importiert dotev
 module.exports = {
   //exportiert die Umgebungsvariablen
   //Generell
   port: process.env.PORT,
   // Datenbank
   database: {
     database: process.env.DATABASE,
     host: process.env.DBHOST,
     port: process.env.DBPORT,
     user: process.env.DBUSER,
     password: process.env.DBPASSWORD,
     dialect: process.env.DIALECT,
   },
   //Auth
   authentication: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET
   }   

 };