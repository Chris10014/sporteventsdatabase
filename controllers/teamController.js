const Teams = require("../models/teams");
const Countries = require("../models/countries");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Teams
exports.getAllTeams = ((req,res, next) => {
    Teams.findAll({ where: req.query, include: Countries })
      .then(
        (teams) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(teams);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new Team 
exports.createTeam = ((req, res, next) => {
  if(!Object.keys(req.body).length) {
    console.log("empty request", req.body);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send("Data is missing.");
    return;
  }
    Teams.create(req.body)
      .then(
        (team) => {
          console.log("Team created: ", team);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(team);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//update one Team
exports.updateTeam = ((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /teams");
});

//delete Teams
exports.deleteTeams = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.statusCode = 403;
    res.end("Delete is not supported on /teams.");
  }
  res.statusCode = 403;
  res.end("Delete is not supported on /teams.");
};

//get one Team by Id
exports.getTeamById = ((req, res, next) => {
    Teams.findByPk(req.params.teamId, { include: Countries })
      .then((team) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(team);
      })
      .catch((err) => next(err));
});

//create a team with an Id
exports.createTeamWithId = (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /teams/:teamId");
};

//update one team by Id 
exports.updateTeamById = (req, res, next) => {
  let teamId = req.params.teamId;

  Teams.findByPk(teamId).then((team) => {
    if (!team) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Team with Id ${teamId} found.`);
      return;
    }
    team
      .update(req.body)
      .then(
        (team) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(team);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
};

//delete a team by Id
exports.deleteTeamById = (req, res, next) => {
  let teamId = req.params.teamId;

  Teams.findByPk(teamId).then((team) => {
    if (!team) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Team with Id ${teamId} found.`);
      return;
    }
    team.destroy();
    console.log(`Team with id ${teamId} deleted.`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(`Team with Id ${teamId} deleted.`);
  });
};