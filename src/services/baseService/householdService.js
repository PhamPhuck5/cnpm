import db from "../models/index.js";
import authServices from "./authServices.js";

async function createHousehold(room, number_motobike, number_car, start_date) {
  let creator = authServices.findUserByID(user);

  const newHousehold = await db.Household.create({
    room,
    number_motobike,
    number_car,
    start_date: new Date(start_date),
    apartment_id: creator.apartment_id,
  });

  return newHousehold;
}

const householdServices = { createHousehold: createHousehold };
export default householdServices;
