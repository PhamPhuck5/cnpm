import db from "../../models/index.js";
import authServices from "./authServices.js";

async function createNewApartment(name, address) {
  const newApartment = await db.Apartment.create({
    name: name,
    address: address,
  });
  return newApartment;
}

async function getAllApartments() {
  return await db.Apartment.findAll({
    attributes: ["id", "name", "address", "area"],
  });
}

export async function getApartmentByUser(userId) {
  let user = await authServices.findUserByID(userId);

  return user.apartment_id;
}

export async function getApartmentInfoForUser(userId) {
  let user = await authServices.findUserByID(userId);

  return await db.Apartment.findOne({
    where: { id: user.apartment_id },
  });
}

const apartmentServices = {
  createNewApartment: createNewApartment,
  getAllApartments: getAllApartments,
  getApartmentByUser: getApartmentByUser,
  getApartmentInfoForUser: getApartmentInfoForUser,
};
export default apartmentServices;
