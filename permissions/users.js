"use strict"

const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (() => {
  ac.grant("anonymous").resource("users")
  .grant("user").resource("users").readOwn(null, ["*", "!updated_at", "!created_at", "!id"]).updateOwn(null, ["*", "!id", "!activated", "!id", "!email", "email_verified", "!role_id"])
  .grant("eventowner").resource("users").extend("user")
  .grant("teamcaptain").resource("users").extend("user")
  .grant("editor").resource("users").extend("user")
  .grant("admin").resource("users").extend("user").createAny(null, [ "*", "!id", "!password"]).readAny(null, ["*", "!password"]).updateAny(null, ["*", "!id", "!email", "!password"]).deleteAny()
  .grant("superadmin").resource("users").extend("admin").createAny(null, ["*", "!id"]).readAny().updateAny(null, [ "*", "!id"]);

  return ac;
})(); //Second () seems to be important