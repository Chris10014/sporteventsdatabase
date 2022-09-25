/**
 * Schreibt Umgebungsvariablen aus .env File in das Objekt variables
 */
require("dotenv").config() //importiert dotev
 module.exports = {
   //exportiert die Umgebungsvariablen
   //Generell
   base_url: process.env.BASE_URL,
   port: process.env.PORT,
   api_v1: process.env.API_V1,
   activation_link_expiring_time: process.env.ACTIVATION_LINK_EXPIRING_TIME,
   // Datenbank
   database: {
     database: process.env.DATABASE,
     host: process.env.DB_HOST,
     port: process.env.DB_PORT,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     dialect: process.env.DIALECT,
   },
   //Auth
   authentication: {
     access_token_secret: process.env.ACCESS_TOKEN_SECRET,
     refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
   },
   //Mail
   mailserver: {
     host: process.env.MAIL_HOST,
     port: process.env.MAIL_PORT,
     user: process.env.MAIL_USER,
     password: process.env.MAIL_PASSWORD,
   },
   activationMail: {
     subject: process.env.ACTIVATION_SUBJECT,
     text: process.env.ACTIVATION_TEXT,
     html: process.env.ACTIVATION_HML,
   },
 };