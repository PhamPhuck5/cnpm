"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addIndex("humans", ["household_id"], {
    name: "idx_humans_household_id",
  });

  await queryInterface.addIndex("residence_records", ["humanId", "start_date"], {
    name: "idx_residence_records_humanId_start_date",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex("residence_records", "idx_residence_records_humanId_start_date");

  await queryInterface.removeIndex("humans", "idx_humans_household_id");
}
