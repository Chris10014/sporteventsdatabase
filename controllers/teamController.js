const Teams = require("../models/teams");
const Countries = require("../models/countries");
const Users = require("../models/users");
const mailer = require("../services/mailer");
const variables = require("../config/variables");
const { getNumberOfTeamMembers } = require("./utils");

//index
exports.index = (res, req, next) => {
  res.sendStatus(200);
};

//get all Teams
exports.getAllTeams = (req, res, next) => {
  Teams.findAll({
    where: req.query,
    include: [{ model: Countries }, { model: Users }],
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
};

//create a new Team
exports.createTeam = (req, res, next) => {
  if (!Object.keys(req.body).length) {
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
};

//update one Team
exports.updateTeam = (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /teams");
};

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
exports.getTeamById = (req, res, next) => {
  Teams.findByPk(req.params.teamId, {
    include: [{ model: Countries }, { model: Users }],
  })
    .then((team) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(team);
    })
    .catch((err) => next(err));
};

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
    const err = new Error("UserId oder teamId missing.");
    err.status = 404;
    err.title = "Empty request";
    err.instance = `${req.method} ${originalUrl}`;
    return next(err);
  }
  Teams.findByPk(teamId)
    .then((team) => {
      if (!team) {
        const err = new Error(`A team with id ${teamId} cold not be found.`);
        err.status = 404;
        err.title = "Unknown team";
        err.instance = `${req.method} ${originalUrl}`;
        return next(err);
      }
      team.getUsers({ where: { id: userId } }).then((users) => {
        if (users[0]) {
          //User is already member
          return res.status(200).json({ title: "Already member", user: users[0] });
        }
        Users.findByPk(userId) //searches for user
          .then((user) => {
            if (!user) {
              return res.status(404).json({ success: false, title: "Unknown user", details: `A user with id ${userId} doesn't exist.`, instance: `${req.originalUrl}` });
            }
            getNumberOfTeamMembers(teamId).then((result) => {
              console.log("\n\naddMember... numberOfMembers: ", result);
              const teamCaptain = result == 0 ? true : false;
              console.log("\nteamCaptain: ", teamCaptain, "\n\n");
              team
                .addUser(user, { through: { admitted: true, team_captain: teamCaptain } }) //adds team to the user
                .then(() => {
                  Teams.findByPk(teamId, {
                    include: {
                      model: Users,
                      where: { id: userId },
                    },
                  }).then((team) => {
                    return res.status(200).json(team);
                  });
                });
            });
          });
      });
    })
    .catch((err) => next(err));
};

/**
 * Remove a user from a team
 * If the user is captain and other team members exist,
 * the next team member gets captain
 * @param {integer} req.userId
 * @param {integer} req.teamId
 * @param {*} res
 * @param {*} next
 *
 * @returns {JSON} user including the remaining team memberships
 */
//
exports.removeMemberFromTeam = (req, res, next) => {
  const userId = req.params.userId;
  const teamId = req.params.teamId;
  if (!userId || !teamId) {
    const err = new Error("UserId oder teamId missing.");
    err.status = 404;
    err.title = "Empty request";
    err.instance = `${req.method} ${originalUrl}`;
    return next(err);
  }
  Teams.findByPk(teamId)
    .then((team) => {
      if (!team) {
        const err = new Error(`A team with id ${teamId} cold not be found.`);
        err.status = 404;
        err.title = "Unknown team";
        err.instance = `${req.method} ${originalUrl}`;
        return next(err);
      }
      team.getUsers({ where: { id: userId } }).then((users) => {
        if (!users[0]) {
          res.status(200).json({ title: "No member", message: "The user wasn't member of this team.", user: users[0] });
          return;
        }
        Users.findByPk(userId, {
          include: [
            {
              model: Teams,
              where: { id: teamId },
            },
          ],
        }) //searches for user
          .then((user) => {
            if (!user) {
              const err = new Error(`A user with id ${userId} could not be found. Or is not a member of the team with id ${teamId}.`);
              err.status = 404;
              err.title = "Unknown user";
              err.instance = `${req.method} ${originalUrl}`;
              return next(err);
            }
            getNumberOfTeamMembers(teamId).then((numberOfTeamMembers) => {
              if (user.teams[0].users_have_teams.team_captain == true && numberOfTeamMembers > 1) {
                //A team captain can only be removed if it is the last member of the team.
                return res.status(403).json({ title: "Operation not processable", message: "A team captain can't be removed from a team as long as the team has still members. Please, assign the team captain's role to another member first. Or if other team captains exist, remove team captain role from that user first.", instance: `${req.method} ${req.originalUrl}` });
              }

              team
                .removeUser(user) //remove user from team
                .then(() => {
                  Users.findByPk(userId, {
                    include: [{ model: Teams }],
                  }).then((user) => {
                     mailer.sendRemovedFromTeam(user, team, ({ err, info }) => {
                       if (err) {
                         const error = new Error(`Mail to removed member wasn't send. But the member is removed from team anyway.`);
                         error.status = 400;
                         error.title = "Removed from team but mail not send";
                         error.instance = `${req.method} ${req.originalUrl}`;
                         error.user = user;
                         error.error = err;
                         next(error);
                         return;
                       }
                        return res.status(200).json({ title: "Removed from team", user: user });
                     });
                   
                  });
                });
            });
          });
      });
    })
    .catch((err) => next(err));
};

//Ask for admission to a team
exports.askForTeamAdmission = (req, res, next) => {
  const teamId = req.params.teamId;
  const userId = req.user.id;

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
      const member = team.users.filter((member) => member.users_have_teams.user_id == userId)[0];

      console.log("member: ", member);
      if (member && member.users_have_teams.admitted === true) {
        console.log("teamController, is admitted: ", true);
        res.status(200).json({ message: `You are already member of the team ${team.team_name}`, title: "Existing membership", error: null });
        return;
      }
      if (member && member.users_have_teams.admitted === false) {
        console.log("teamController, is admitted: ", false);
        res.status(200).json({ message: `You have already asked for admission to team ${team.team_name}. But admission is still pending.`, title: "Already asked for admission", error: null });
        return;
      }
      team
        .addUser(req.user)
        .then(() => {
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
exports.confirmTeamAdmission = (req, res, next) => {
  const userId = req.params.userId;
  const teamId = req.params.teamId;

  Users.findByPk(userId).then((user) => {
    if (!user) {
      console.log("no member");
      const err = new Error(`User with id ${userId} doesn't exist.`);
      err.status = 404;
      err.title = "Unknown user";
      err.instance = `${req.method} ${req.originalUrl}`;
      return next(err);
    }
    Teams.findByPk(teamId, {
      include: [{ model: Users, where: { id: userId } }],
    }).then((team) => {
      if (!team) {
        const err = new Error(`Team with id ${teamId} doesn't exist.`);
        err.status = 404;
        err.title = "Unknown team";
        err.instance = `${req.method} ${req.originalUrl}`;
        return next(err);
      }
      //Check if user is already member of the team
      const membership = team.users.filter((user) => user.users_have_teams.user_id == userId)[0];
      if (!membership) {
        const err = new Error(`User did not ask for admission to the team.`);
        err.status = 400;
        err.title = "No ask for admission";
        err.instance = `${req.method} ${req.originalUrl}`;
        return next(err);
      }
      if (membership.users_have_teams.admitted === true) {
        return res.status(200).json({ title: "Existing membership", message: `User was already member of the team ${team.team_name}.`, team: team });
      }
      //update team membership
      team.addUsers(user, { through: { admitted: true } }).then(() => {
        Teams.findByPk(teamId, {
          include: { model: Users, where: { id: userId } },
        })
          .then((team) => {
            mailer.sendTeamAdmission(user, team, ({ err, info }) => {
              if (err) {
                const error = new Error(`Mail to confirm admission wasn't send.`);
                error.status = 400;
                error.title = "Mail not send";
                error.instance = `${req.method} ${req.originalUrl}`;
                error.error = err;
                next(error);
                return;
              }
              return res.status(201).json({ title: "Admission confirmed", message: `E-mail about confirmation of the admission to team ${team.team_name} send to ${user.first_name} ${user.last_name}`, team: team, error: null });
            });
          })
          .catch((err) => next(err));
      });
    });
  });
};

//Reject admission to a team
exports.rejectTeamAdmission = (req, res, next) => {
  const userId = req.params.userId;
  const teamId = req.params.teamId;

  Users.findByPk(userId).then((user) => {
    if (!user) {
      const err = new Error(`User with id ${userId} doesn't exist.`);
      err.status = 404;
      err.title = "Unknown user";
      err.instance = `${req.method} ${req.originalUrl}`;
      return next(err);
    }
    Teams.findByPk(teamId, {
      include: [{ model: Users }],
    }).then((team) => {
      if (!team) {
        const err = new Error(`Team with id ${teamId} doesn't exist.`);
        err.status = 404;
        err.title = "Unknown team";
        err.instance = `${req.method} ${req.originalUrl}`;
        return next(err);
      }
      //Check if user is already member of the team
      const membership = team.users.filter((user) => user.users_have_teams.user_id == userId)[0];
      if (!membership) {
        const err = new Error(`User did not ask for admission to the team.`);
        err.status = 400;
        err.title = "No admission inquired";
        err.instance = `${req.method} ${req.originalUrl}`;
        return next(err);
      }

      //Delete user from team
      team
        .removeUsers(user) //Delete user entry in through table
        .then(() => {
          mailer.sendRejectAdmission(user, team, ({ err, info }) => {
            if (err) {
              const error = new Error(`Mail to reject admission wasn't send.`);
              error.status = 400;
              error.title = "Mail not send";
              error.instance = `${req.method} ${req.originalUrl}`;
              error.error = err;
              next(error);
              return;
            }
            return res.status(201).json({ title: "Admission rejected", message: `E-mail about rejection of the admission to team ${team.team_name} send to ${user.first_name} ${user.last_name}`, team: team, error: null });
          });
        })
        .catch((err) => next(err));
    });
  });
};
