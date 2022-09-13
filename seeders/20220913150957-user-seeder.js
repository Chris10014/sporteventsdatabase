'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        first_name: "Christoph",
    last_name: "Lansche",
    nickname: "Tristoph",
    email: "lansche@lansche.de",
    gender: "M",
    password: "$10$TyXpmc2tjUJ5OPG8h43oNOqwNJKYeMXSBaV.g350u9w3ZLs7F.79W",
    year_of_birth: 1969,
    country_id: 48,
   
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
