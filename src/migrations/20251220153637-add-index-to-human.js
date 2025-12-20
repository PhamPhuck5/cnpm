"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addIndex("humans", {
    fields: ["household_id"],
    name: "idx_human",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex("humans", "idx_human");
}
