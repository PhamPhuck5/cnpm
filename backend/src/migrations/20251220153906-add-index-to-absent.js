"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addIndex("absents", {
    fields: ["humanId"],
    name: "idx_absent",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex("absents", "idx_absent");
}
