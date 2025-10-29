import db from "../../models/index.js";

async function createNewApartment(name, address) {
  const newApartment = await db.Apartment.create({
    name: name,
    address: address,
  });
  return newApartment;
}

const apartmentServices = { createNewApartment: createNewApartment };
export default apartmentServices;
