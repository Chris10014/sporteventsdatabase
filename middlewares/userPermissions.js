"use strict"

const { canViewUser } = require("../permissions/user");

const isAllowedToGetUser = ((req, res, next) => {
    console.log("from authGetUser: ", req.user.role.name, "\nmöööp", req.params.userId);
    if (!canViewUser(req.user, req.params.userId)) {
        const error = new Error("You are not allowed to see data from other users than yourself.");
        error.status = 403;
        error.title = "Not allowed"
     return next(error);
    }

    next();

});

module.exports = {
  isAllowedToGetUser,
};