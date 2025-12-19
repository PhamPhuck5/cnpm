"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("humans", ["household_id"], {
      name: "idx_humans_household_id",
    });

    await queryInterface.addIndex("absents", ["humanId", "start_date"], {
      name: "idx_absents_humanId_start_date",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "absents",
      "idx_absents_humanId_start_date"
    );

    await queryInterface.removeIndex("humans", "idx_humans_household_id");
  },
};
