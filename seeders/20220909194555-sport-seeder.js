'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Sports", [
      {
        code: "swi",
        sport_de: "Schwimmen",
        sport_en: "Swimming",
        verb_de: "schwimmen",
        verb_en: "swim",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "rb",
        sport_de: "Rennrad",
        sport_en: "Road bike",
        verb_de: "rennradeln",
        verb_en: "road cycling",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "mtb",
        sport_de: "Mountainbike",
        sport_en: "Mountain bike",
        verb_de: "mountainbiken",
        verb_en: "mountain biking",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "run",
        sport_de: "Laufen",
        sport_en: "Running",
        verb_de: "laufen",
        verb_en: "run",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "trail",
        sport_de: "Crosslauf",
        sport_en: "Trail run",
        verb_de: "laufen",
        verb_en: "run",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        code: "tri",
        sport_de: "Triathlon",
        sport_en: "Triathlon",
        multisport: true,
        verb_de: "",
        verb_en: "",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "dua",
        sport_de: "Duathlon",
        sport_en: "Duathlon",
        multisport: true,
        verb_de: "",
        verb_en: "",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "aqu",
        sport_de: "Aquathlon",
        sport_en: "Aquathlon",
        multisport: true,
        verb_de: "",
        verb_en: "",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: "sr",
        sport_de: "Swim and Run",
        sport_en: "Swim and Run",
        multisport: true,
        verb_de: "",
        verb_en: "",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Sports", null, {});
  },
};