"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addIndex("payments", {
    fields: ["bill_id", "household_id"],
    name: "idx_payments_bill_household",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex("payments", "idx_payments_bill_household");
}
