// services/humanService.js
import db from "../../models/index.js";
import { getApartmentByUser } from "./apartmentService.js";
import authServices from "./authServices.js";
import { Op } from "sequelize";

async function createHuman(
  household_id,
  name,
  identity,
  phonenumber,
  email,
  dateOfBirth,
  role,
  living = true,
  stay_type,
  start_date,
  end_date
) {
  const finalStayType = stay_type || "Thường trú";

  let finalStartDate = start_date;
  let finalEndDate = end_date;

  if (finalStayType === "Thường trú") {
    finalStartDate = start_date || new Date();
    finalEndDate = null;
  }
  return await db.Human.create({
    household_id,
    name,
    identity,
    phonenumber,
    email,
    dateOfBirth,
    role,
    living,
    stay_type: finalStayType,
    start_date: finalStartDate,
    end_date: finalEndDate,
  });
}

async function setLivingFalse(humanId) {
  return await db.Human.update(
    {
      living: false,
      end_date: new Date(),
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
      end_date: new Date(),
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

async function getAllHumansByApartmentId(userId) {
  let user = await authServices.findUserByID(userId);
  let apartmentId = user.apartment_id;
  try {
    const humans = await db.Human.findAll({
      include: [
        {
          model: db.Household,
          where: { apartment_id: apartmentId },
          required: true,
        },
      ],
    });
    return humans;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cư dân:", error);
    throw error;
  }
}

async function getHumanByName(name, userId) {
  let user = await authServices.findUserByID(userId);
  const apartmentId = await getApartmentByUser(userId);
  return db.Human.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`,
      },
    },
    include: [
      {
        model: db.Household,
        required: true,
        where: {
          apartment_id: apartmentId,
        },
        attributes: ["id", "room", "apartment_id", "leave_date"],
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
  getAllHumansByApartmentId,
  getHumanByName,
};
