export async function up(queryInterface, Sequelize) {
  await queryInterface.addIndex("bills", {
    fields: ["apartment_id", "start_date"],
    name: "idx_bills_apartment_startdate",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex("bills", "idx_bills_apartment_startdate");
}
