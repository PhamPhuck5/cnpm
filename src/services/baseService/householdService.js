import db from "../../models/index.js";
import authServices from "./authServices.js";

async function createHousehold(room, number_motorbike, number_car, start_date, userId) {
  let creator = await authServices.findUserByID(userId);

  const newHousehold = await db.Household.create({
    apartment_id: creator.apartment_id,
    room,
    number_motorbike,
    number_car,
    start_date: start_date ? new Date(start_date) : new Date(),
  });

  return newHousehold;
} //edited

async function getAllHouseholds(userId) {
  const user = await db.User.findByPk(userId);

  return await db.Household.findAll({
    where: {
      apartment_id: user.apartment_id,
    },
  });
}
async function findHouseholdById(id) {
  return await db.Household.findOne({
    where: { id },
  });
}
async function getAllLivingHouseholds(userId) {
  const user = await db.User.findByPk(userId);

  return await db.Household.findAll({
    where: {
      apartment_id: user.apartment_id,
      leave_date: null,
    },
  });
} //new

async function getHouseholdDetails(id) {
  return await db.Household.findOne({
    where: { id },
    include: [{ model: db.Apartment }, { model: db.Human }],
  });
} //edited

async function getHouseholdsByRoom(room, userId) {
  const user = await db.User.findByPk(userId);

  return await db.Household.findAll({
    where: {
      apartment_id: user.apartment_id,
      room: room,
    },
  });
} //to controller

async function getLivingHouseholdByRoom(room, userId) {
  const user = await db.User.findByPk(userId);

  return await db.Household.findOne({
    where: {
      apartment_id: user.apartment_id,
      room: room,
      leave_date: null,
    },
  });
} //new

async function onHouseholdStopLiving(room, userId, stopTime) {
  const household = await getLivingHouseholdByRoom(room, userId);
  household.leave_date = stopTime ? new Date(stopTime) : new Date();
  await household.save();
} //new

const householdServices = {
  createHousehold: createHousehold,
  getAllHouseholds: getAllHouseholds,
  getHouseholdDetails: getHouseholdDetails,
  getHouseholdsByRoom: getHouseholdsByRoom,
  getAllLivingHouseholds: getAllLivingHouseholds,
  findHouseholdById: findHouseholdById,
  getLivingHouseholdByRoom: getLivingHouseholdByRoom,
  onHouseholdStopLiving: onHouseholdStopLiving,
};
export default householdServices;
