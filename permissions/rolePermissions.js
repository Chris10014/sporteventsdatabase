"use strict"

const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.rolePermissions = (() => {
  //resource users
  ac.grant("user").resource("users").readOwn(null, ["*", "!updated_at", "!created_at", "!id"]).updateOwn(null, ["*", "!id", "!activated", "!id", "!email", "email_verified", "!role_id"])
  .grant("eventowner").resource("users").extend("user")
  .grant("teamcaptain").resource("users").extend("user")
  .grant("editor").resource("users").extend("user")
  .grant("admin").resource("users").extend("user").createAny(null, [ "*", "!id", "!password"]).readAny(null, ["*", "!password"]).updateAny(null, ["*", "!id", "!email", "!password"]).deleteAny()
  .grant("superadmin").resource("users").extend("admin").createAny(null, ["*", "!id"]).readAny().updateAny(null, [ "*", "!id"])
  //resource sportEvents
  .grant("eventowner").resource("sportEvents").createAny().updateOwn()
  .grant("editor").resource("sportEvents").createAny().updateAny() 
  .grant("admin").resource("sportEvents").extend("editor").deleteAny()
  .grant("superadmin").resource("sportEvents").extend("admin")
   //resource countries
  .grant("eventowner").resource("countries").createAny().updateOwn()
  .grant("editor").resource("countries").createAny().updateAny() 
  .grant("admin").resource("countries").extend("editor").deleteAny()
  .grant("superadmin").resource("countries").extend("admin")
  //races
  .grant("eventowner").resource("races").createOwn().updateOwn().deleteOwn()
  .grant("editor").resource("races").createAny().updateAny().deleteAny()
  .grant("admin").resource("races").extend("editor")
  .grant("superadmin").resource("races").extend("admin")
  //courses
  .grant("eventowner").resource("courses").createOwn().updateOwn().deleteOwn()
  .grant("editor").resource("courses").createAny().updateAny().deleteAny()
  .grant("admin").resource("courses").extend("editor")
  .grant("superadmin").resource("courses").extend("admin")
  //resource eventDates
  .grant("eventowner").resource("eventDates").createOwn().updateOwn().deleteOwn()
  .grant("editor").resource("eventDates").createAny().updateAny().deleteAny()
  .grant("admin").resource("eventDates").extend("editor")
  .grant("superadmin").resource("eventDates").extend("admin")
  //resource roles
  .grant("admin").resource("roles").readAny().createAny().updateAny()
  .grant("superadmin").resource("roles").extend("admin").deleteAny()
  //resource sports
  .grant("editor").resource("sports").readAny().createAny()
  .grant("admin").resource("sports").extend("editor").updateAny().deleteAny()
  .grant("superadmin").resource("sports").extend("admin")
  //resource teams
  .grant("user").resource("teams").updateOwn()
  .grant("eventowner").resource("teams").extend("user")
  .grant("editor").resource("teams").extend("user")
  .grant("teamcaptain").resource("teams").extend("user")
  .grant("admin").resource("teams").extend("teamcaptain").updateAny()
  .grant("superadmin").resource("teams").extend("admin").deleteAny()
  ;

  return ac;
})(); //Second () seems to be important