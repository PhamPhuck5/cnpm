import db from "../../models/index.js";
import { Op } from "sequelize";

async function createResidenceRecord(humanId, start_date, last_date, isAbsent = true) {
  return await db.ResidenceRecord.create({
    humanId,
    start_date,
    last_date,
    is_absent: isAbsent,
  });
}

async function endRecord(humanId, start_date, last_date) {
  let lastDate = last_date ? new Date(last_date) : new Date();
  return await db.ResidenceRecord.update(
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

async function endRecordById(recordId, last_date) {
  let lastDate = last_date ? new Date(last_date) : new Date();
  return await db.ResidenceRecord.update(
    {
      last_date: lastDate,
    },
    {
      where: {
        id: recordId,
      },
    }
  );
}

/**
 * by defaulse this func return 10 latest records
 * @param {*} householdId
 * @param {*} startDate
 * @param {*} endDate
 * @param {*} limit
 * @param {*} offset
 * @returns
 */
async function getRecordsByHousehold(householdId, startDate, endDate, limit = 10, offset = 0) {
  const whereAbsent = {};

  if (startDate) {
    whereAbsent.start_date = { [Op.gte]: startDate };
  }

  if (endDate) {
    whereAbsent.last_date = { [Op.lte]: endDate };
  }

  return await db.ResidenceRecord.findAll({
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

async function getAllRecordByHousehold(householdId) {
  return await getRecordsByHousehold(householdId);
}

export default {
  createResidenceRecord,
  endRecord,
  endRecordById,
  getRecordsByHousehold,
  getAllRecordByHousehold,
};
