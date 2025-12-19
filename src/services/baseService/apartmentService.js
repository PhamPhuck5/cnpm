import db from "../../models/index.js";

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

const apartmentServices = { 
  createNewApartment: createNewApartment ,
  getAllApartments: getAllApartments
};
export default apartmentServices;
