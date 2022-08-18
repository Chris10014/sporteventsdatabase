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
   return queryInterface.bulkInsert("Teams_and_hosts", [
     {
       team_name: "TSG Eppstein",
       postal_code: "65817",
       city: "Eppstein",
       country_id: 83,
       created_at: new Date(),
       updated_at: new Date(),
     },
     {
       team_name: "TV Lorsbach",
       postal_code: "65719",
       city: "Hofheim",
       country_id: 83,
       created_at: new Date(),
       updated_at: new Date(),
     },
     {
       team_name: "RC Hattersheim",
       postal_code: "65795",
       city: "Hattersheim",
       country_id: 83,
       created_at: new Date(),
       updated_at: new Date(),
     },
     {
       team_name: "LSV Ladenburg",
       postal_code: "68526",
       city: "Ladenburg",
       country_id: 83,
       created_at: new Date(),
       updated_at: new Date(),
     },
     {
       team_name: "Ironman Germany GmbH",
       postal_code: "65835",
       city: "Liederbach",
       country_id: 83,
       created_at: new Date(),
       updated_at: new Date()
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
    return queryInterface.bulkDelete("Teams_and_hosts", null, {});
  }
};
