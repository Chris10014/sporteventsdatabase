'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   return queryInterface.bulkInsert("Roles", [
     {
       name: "user",
       description: "A registered user.",
       created_at: new Date(),
       updated_at: new Date(),
     },
     {
       name: "eventOwner",
       description: "A registered user who can insert new sport events. The eventOwener can change and upate the events he has inserted.",
       created_at: new Date(),
       updated_at: new Date(),
     },
     {
       name: "editor",
       description: "A registered user who can insert new sport events and edit existing events as well.",
       created_at: new Date(),
       updated_at: new Date(),
     },
     {
       name: "teamCaptain",
       description: "The first registered user of a team becomed teamCaptain. He can edit team related things, team activities and allow user to enter the team as well as he can exclude users from his team.",
       created_at: new Date(),
       updated_at: new Date(),
     },

     {
       name: "admin",
       description: "The admin can edit all sport events and activities.",
       created_at: new Date(),
       updated_at: new Date(),
     },
     {
       name: "superAdmin",
       description: "The super admin can do anything.",
       created_at: new Date(),
       updated_at: new Date(),
     },
   ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Roles", null, {});
  }
};
