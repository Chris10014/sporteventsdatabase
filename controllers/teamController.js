const Teams = require("../models/teams");
const Countries = require("../models/countries");
const Users = require("../models/users");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Teams
exports.getAllTeams = ((req,res, next) => {
    Teams.findAll({
      where: req.query,
      include: [
        { model: Countries },
        { model: Users }
      ],
    })
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

//Manage members of a team
//Add a user to a team
exports.addMemberToTeam = (req, res, next) => {
  const userId = req.params.userId;
  const teamId = req.params.teamId;
  if (!userId || !teamId) {
    return res.status(400).json({ success: false, title: "Empty request", details: "User id or team id is missing.", instance: `${req.originalUrl}` });
  }
  Teams.findByPk(teamId, {
    include: [{ model: Users }],
  })
    .then((team) => {
      if (!team) {
          return res.status(404).json({ success: false, title: "Unknown team", details: `A team with id ${userId} cold not be found.`, instance: `${req.originalUrl}` });
      }
      const user = team.users.filter((user) => user.id === userId)[0];
      console.log("Pkt 3.1: " + userId + " " + teamId + " \n", user);
      if (user) {
        return res.status(200).json(team);
      }
      Users.findOne({ where: { id: userId } }) //searches for user
        .then((user) => {
          if (!user) {
            return res.status(404).json({ success: false, title: "Unknown user", details: `A user with id ${userId} doesn't exist.`, instance: `${req.originalUrl}` });
          }
          team
            .addUser(user) //adds team to the user
            .then(() => {
              Teams.findByPk(teamId, {
                include: [{ model: Users }],
              }).then((team) => {
                return res.status(200).json(team);
              }).catch((err) => next(err));
            }).catch((err) => next(err));         
        }).catch((err) => next(err));
    }).catch((err) => next(err));
};

//Remove a team from a user
exports.removeMemberFromTeam = (req, res, next) => {
  const userId = req.params.userId;
  const teamId = req.params.teamId;
  if (!userId || !teamId) {
    return res.status(400).json({ success: false, title: "Empty request", details: "UserId oder teamId missing.", instance: `${req.originalUrl}` });
  }
  Teams.findByPk(teamId, {
    include: [{ model: Users }],
  })
    .then((team) => {
      if (!team) {
        return res.status(400).json({ success: false, title: "Unknown team", details: `Team with id ${teamId} could not be found.`, instance: `${req.originalUrl}` });
      }
      const user = team.users.filter(async (user) => user.id === userId)[0];
      console.log("\nUser: ", user);
      if (!user) {
        return res.status(200).json(team);
      }
      Users.findByPk(userId) //searches for user
        .then((user) => {
          if (!user) {
            return res.status(404).json({ success: false, title: "Unknown user", details: `User with id ${userId} doesn't exist.`, instance: `${req.originalUrl}` });
          }
          team.removeUser(user) //remove user from team
            .then(() => {
              Teams.findByPk(teamId, {
                include: [{ model: Users }],
              })
                .then((team) => {
                  return res.status(200).json(team);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
}
