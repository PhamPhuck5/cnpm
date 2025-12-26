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

  return await authServices.findUserByID(user.apartment_id); //new
}

const apartmentServices = {
  createNewApartment: createNewApartment,
  getAllApartments: getAllApartments,
};
export default apartmentServices;
