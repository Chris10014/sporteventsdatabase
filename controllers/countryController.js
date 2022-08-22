const Countries = require("../models/countries");
const Teams = require("../models/teams");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Countries
exports.getAllCountries = ((req,res, next) => {
    Countries.findAll({ where: req.query })
      .then(
        (countries) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(countries);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new Country 
exports.createCountry = ((req, res, next) => {
  if(!Object.keys(req.body).length) {
    console.log("empty request", req.body);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send("Data is missing.");
    return;
  }
    Countries.create(req.body)
      .then(
        (country) => {
          console.log("Country created: ", country);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(country);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//update one Country
exports.updateCountry = ((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /countries");
});

//delete Countries
exports.deleteCountries = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.statusCode = 403;
    res.end("Delete is not supported on /countries.");
  }
  res.statusCode = 403;
  res.end("Delete is not supported on /countries.");
};

//get one Country by Id
exports.getCountryById = ((req, res, next) => {
    Countries.findByPk(req.params.countryId)
      .then((country) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(country);
      })
      .catch((err) => next(err));
});

//create a country with an Id
exports.createCountryWithId = (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /countries/:countryId");
};

//update one country by Id 
exports.updateCountryById = (req, res, next) => {
  let countryId = req.params.countryId;

  Countries.findByPk(countryId).then((country) => {
    if (!country) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Country with Id ${countryId} found.`);
      return;
    }
    country
      .update(req.body)
      .then(
        (country) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(country);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
};

//delete a country by Id
exports.deleteCountryById = (req, res, next) => {
  let countryId = req.params.countryId;

  Countries.findByPk(countryId).then((country) => {
    if (!country) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Country with Id ${countryId} found.`);
      return;
    }
    country.destroy();
    console.log(`Country with id ${countryId} deleted.`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(`Country with Id ${countryId} deleted.`);
  });
};