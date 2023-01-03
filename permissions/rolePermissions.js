"use strict"

const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (() => {
  //resource users
  ac.grant("anonymous").resource("users")
  .grant("user").resource("users").readOwn(null, ["*", "!updated_at", "!created_at", "!id"]).updateOwn(null, ["*", "!id", "!activated", "!id", "!email", "email_verified", "!role_id"])
  .grant("eventowner").resource("users").extend("user")
  .grant("teamcaptain").resource("users").extend("user")
  .grant("editor").resource("users").extend("user")
  .grant("admin").resource("users").extend("user").createAny(null, [ "*", "!id", "!password"]).readAny(null, ["*", "!password"]).updateAny(null, ["*", "!id", "!email", "!password"]).deleteAny()
  .grant("superadmin").resource("users").extend("admin").createAny(null, ["*", "!id"]).readAny().updateAny(null, [ "*", "!id"])
  //resource eventDates
  .grant("eventowner").resource("eventDates").createOwn().updateOwn().deleteOwn()
  .grant("editor").resource("eventDates").createAny().updateAny().deleteAny()
  .grant("admin").resource("eventDates").createAny().updateAny().deleteAny()
  //resource sportEvents
  .grant("eventowner").resource("sportEvents").createAny().updateOwn()
  .grant("editor").resource("sportEvents").createAny().updateAny() 
  .grant("admin").resource("sportEvents").createAny().updateAny().deleteAny();

  return ac;
})(); //Second () seems to be important

// This is actually how the grants are maintained internally.
//   let grantsObject = {
//     user: {
//       users: {
//         "read:own": ["*"],
//         "update:own": ["*"],
//       },
//     },
//     eventowner: {
//       users: {
//         "read:own": ["*"],
//         "update:own": ["*"],
//       },
//     },
//     teamcaptain: {
//       users: {
//         "read:own": ["*"],
//         "update:own": ["*"],
//       },
//     },
//     editor: {
//       users: {
//         "read:own": ["*"],
//         "update:own": ["*"],
//       },
//     },
//     admin: {
//       users: {
//         "read:any": ["*"],
//         "create:any": ["*"],
//         "update:any": ["*"],
//         "delete:any": ["*"],
//       },
//       eventDates: {
//         "create:any": ["*"],
//       },
//       sportEvents: {
//         "create:any": ["*"],
//       },
//     },
//     superadmin: {
//       users: {
//         "read:any": ["*"],
//         "create:any": ["*"],
//         "update:any": ["*"],
//         "delete:any": ["*"],
//       },
//       eventDates: {
//         "create:any": ["*"],
//       },
//       sportEvents: {
//         "create:any": ["*"],
//       },
//     },
//   };

// const ac = AccessControl(grantsObject);

// exports.roles = (() => {
//   ac.grant();
//   return ac;
// })();
