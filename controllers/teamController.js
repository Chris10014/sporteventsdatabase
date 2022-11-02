const Teams = require("../models/teams");
const Countries = require("../models/countries");
const Users = require("../models/users");
const mailer = require("../services/mailer");
const variables = require("../config/variables");

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

//Ask for admission to a team 
exports.askForTeamAdmission = (req, res, next) => {
  const teamId = req.params.teamId;
  const userId = req.user.id;
  console.log("\n\nfrom teamCtr/askForAdmission 1 - teamId: ", teamId, " userId: ", userId, "\n\n")
  Teams.findOne({
    include: { model: Users },
    where: { id: teamId },
  })
    .then((team) => {
      if (!team) {
        const error = new Error(`Team with id ${teamId} not found. Please check the id and the team name.`);
        error.status = 404;
        error.title = "Unknown team";
        error.instance = `${req.method} ${req.originalUrl}`;
        return next(error);
      }
       console.log("\n\nfrom teamCtr/askForAdmission 2 - team: ", team.team_name, "\n\n");
      const member =  team.users.filter((member) => member.users_have_teams.user_id == userId)[0];
      
        console.log("member: ", member);
      if (member && member.users_have_teams.admitted === true) {
         console.log("teamController, is admitted: ", true);
        res.status(200).json({ message: `You are already member of the team ${team.team_name}`, title: "Existing membership", error: null });
        return;
      }
      if (member && member.users_have_teams.admitted === false) {
        console.log("teamController, is admitted: ", false)
        res.status(200).json({ message: `You have already asked for admission to team ${team.team_name}. But admission is still pending.`, title: "Already asked for admission", error: null });  
        return;
      }

      console.log("teamCtr, user: ", req.user.id);
      team
        .addUser(req.user)
        .then(() => {          
              console.log("before mailer: ", team)
              mailer.askForTeamAdmission(req.user, team, ({ err, info }) => {
                if (err) {
                  const error = new Error(`Mail to ask for admission wasn't send.`);
                  error.status = 400;
                  error.title = "Mail not send";
                  error.instance = `${req.method} ${req.originalUrl}`;
                  error.resendAskForAdmissionLink = `${variables.base_url}:${variables.port}/api/V1/askForAdmission/${req.user.id}/${team.id}`;
                  error.error = err;
                  next(error);
                  return;
                }
                return res.status(201).json({ title: "Asked for Admission", message: `E-mail(s) to ask for admission to team ${team.team_name} send to ${info.eMailCounter} team captain(s)`, eMailCounter: info.eMailCounter, error: null });
              });
            
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

//Confirm admission to a team 
exports.confirmTeamAdmission = ((req, res, next) => {
  const memberId = req.params.memberId;
  const teamId = req.params.teamId;

  console.log("\n\nconfirmTeamAdmission, memberId", memberId, " teamId: ", teamId, "\n\n");
  return res.status(200).json({ title: "Confirmed Admission" });
});

//Reject admission to a team 
exports.rejectTeamAdmission = ((req, res, next) => {
  const memberId = req.params.memberId;
  const teamId = req.params.teamId;

  console.log("\n\nrejectTeamAdmission, memberId", memberId, " teamId: ", teamId, "\n\n");
  return res.status(200).json({ title: "Admission rejected" });
});
