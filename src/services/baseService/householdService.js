import db from "../../models/index.js";
import authServices from "./authServices.js";

async function createHousehold(room, number_motobike, number_car, start_date, userId, type, feePerMeter) {
  let creator = await authServices.findUserByID(userId);

  const newHousehold = await db.Household.create({
    room,
    number_motobike,
    number_car,
    start_date: start_date ? new Date(start_date) : new Date(),
    apartment_id: creator.apartment_id,
    type,
    feePerMeter,
  });

  return newHousehold;
}

async function getAllHouseholds(userId) {
  const user = await db.User.findByPk(userId);

  return await db.Household.findAll({
    where: {
      apartment_id: user.apartment_id,
    },
    include: [
      {
        model: db.Apartment,
      },
    ],
  });
}

async function getHouseholdDetails(id) {
  return await db.Household.findOne({
    where: { id },
    include: [{ model: db.Apartment }, { model: db.Apartment }, { model: db.Human }],
  });
}

export const findHouseholdByUser = getAllHouseholds;
const householdServices = {
  createHousehold: createHousehold,
  getAllHouseholds: getAllHouseholds,
  getHouseholdDetails: getHouseholdDetails,
  findHouseholdByUser: findHouseholdByUser,
};
export default householdServices;
