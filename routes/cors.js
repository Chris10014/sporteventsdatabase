const express = require("express");
const cors = require("cors");
const app = express();

const whitelist = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://localhost:3443",
  "http://localhost:3001",
  "http://localhost:3002"
];
var corsOptionsDelegate = (req, callback) => {
  console.log("test");
  console.log(req.header("Origin"));
  var corsOptions;
  
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  console.log("co: ",corsOptions)
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
