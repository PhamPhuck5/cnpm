// services/absentService.js
import db from "../../models/index.js";
import { Op } from "sequelize";

async function createAbsent(humanId, start_date, last_date) {
  return await db.Absent.create({
    humanId,
    start_date,
    last_date,
  });
}

async function endAbsent(humanId, start_date, last_date) {
  let lastDate = last_date ? new Date(last_date) : new Date();
  return await db.Absent.update(
    {
      last_date: lastDate,
    },
    {
      where: {
        humanId,
        start_date,
      },
    }
  );
}

/**
 * by defaulse this func return 10 latest absents
 * @param {*} householdId
 * @param {*} startDate
 * @param {*} endDate
 * @param {*} limit
 * @param {*} offset
 * @returns
 */
async function getAbsentsByHousehold(householdId, startDate, endDate, limit = 10, offset = 0) {
  const whereAbsent = {};

  if (startDate) {
    whereAbsent.start_date = { [Op.gte]: startDate };
  }

  if (endDate) {
    whereAbsent.last_date = { [Op.lte]: endDate };
  }

  return await db.Absent.findAll({
    where: whereAbsent,
    include: [
      {
        model: db.Human,
        required: true,
        where: { household_id: householdId },
        attributes: ["id", "name", "phonenumber", "email", "living", "dateOfBirth", "role"],
      },
    ],
    order: [["start_date", "DESC"]],
    limit: limit || null,
    offset: offset || null,
  });
}

async function getAllAbsentsByHousehold(householdId) {
  return await getAbsentsByHousehold(householdId);
}

export default {
  createAbsent,
  getAbsentsByHousehold,
  getAllAbsentsByHousehold,
  endAbsent,
};
