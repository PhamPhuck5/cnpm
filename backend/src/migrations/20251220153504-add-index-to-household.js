"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addIndex("households", {
    fields: ["apartment_id", "room"],
    name: "idx_household",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex("households", "idx_household");
}
