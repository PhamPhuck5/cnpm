// services/humanService.js
import db from "../../models/index.js";
import { getApartmentByUser } from "./apartmentService.js";
async function createHuman(household_id, name, phonenumber, email, dateOfBirth, role, living = true) {
  return await db.Human.create({
    household_id,
    name,
    phonenumber,
    email,
    dateOfBirth,
    role,
    living,
  });
}

async function setLivingFalse(humanId) {
  return await db.Human.update(
    {
      living: false,
    },
    {
      where: {
        id: humanId,
      },
    }
  );
}
async function setLivingTrue(humanId) {
  return await db.Human.update(
    {
      living: true,
    },
    {
      where: {
        id: humanId,
      },
    }
  );
}

async function getAllByHousehold(household_id) {
  return await db.Human.findAll({
    where: { household_id },
    order: [["id", "ASC"]],
  });
}

async function getLivingByHousehold(household_id) {
  return await db.Human.findAll({
    where: { household_id, living: true },
    order: [["id", "ASC"]],
  });
}
async function getHumanByName(name, userId) {
  const apartmentId = await getApartmentByUser(userId);
  return Human.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`,
      },
    },
    include: [
      {
        model: Household,
        required: true,
        where: {
          apartment_id: apartmentId,
        },
        attributes: ["id", "room", "apartment_id"],
      },
    ],
  });
}

export default {
  createHuman,
  setLivingFalse,
  setLivingTrue,
  getAllByHousehold,
  getLivingByHousehold,
  getHumanByName,
};
