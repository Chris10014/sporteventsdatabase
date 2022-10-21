"use strict"


function canViewUser(me, userId) {
    console.log("me role: ", me.id, " userId: ", userId);
  return (me.role.name.toLowerCase() === "superadmin" ||
  me.role.name.toLowerCase() === "admin" ||
  me.id*1 === userId*1);
}

function scopedProjects(user, projects) {
  if (user.role === ROLE.ADMIN) return projects;
  return projects.filter((project) => project.userId === user.id);
}

function canDeleteProject(user, project) {
  return project.userId === user.id;
}

module.exports = {
  canViewUser,
  scopedProjects,
  canDeleteProject,
};