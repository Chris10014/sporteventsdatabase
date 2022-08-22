const Roles = require("../models/roles");

//index
exports.index = ((res, req, next) => {
    res.sendStatus(200);
});

//get all Roles
exports.getAllRoles = ((req,res, next) => {
    Roles.findAll({ where: req.query })
      .then(
        (roles) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(roles);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//create a new Role 
exports.createRole = ((req, res, next) => {
  if(!Object.keys(req.body).length) {
    console.log("empty request", req.body);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send("Data is missing.");
    return;
  }
    Roles.create(req.body)
      .then(
        (role) => {
          console.log("Role created: ", role);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(role);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
});

//update one Role
exports.updateRole = ((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /roles");
});

//delete Roles
exports.deleteRoles = (req, res, next) => {
  if (Object.entries(req.query).length == 0) {
    res.statusCode = 403;
    res.end("Delete is not supported on /roles.");
  }
  res.statusCode = 403;
  res.end("Delete is not supported on /roles.");
};

//get one Role by Id
exports.getRoleById = ((req, res, next) => {
    Roles.findByPk(req.params.roleId)
      .then((role) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(role);
      })
      .catch((err) => next(err));
});

//create a role with an Id
exports.createRoleWithId = (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /roles/:roleId");
};

//update one role by Id 
exports.updateRoleById = (req, res, next) => {
  let roleId = req.params.roleId;

  Roles.findByPk(roleId).then((role) => {
    if (!role) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Role with Id ${roleId} found.`);
      return;
    }
    role
      .update(req.body)
      .then(
        (role) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(role);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
};

//delete a role by Id
exports.deleteRoleById = (req, res, next) => {
  let roleId = req.params.roleId;

  Roles.findByPk(roleId).then((role) => {
    if (!role) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.send(`No Role with Id ${roleId} found.`);
      return;
    }
    role.destroy();
    console.log(`Role with id ${roleId} deleted.`);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(`Role with Id ${roleId} deleted.`);
  });
};