// controllers/absentController.js
import absentService from "../services/baseService/absentService.js";

async function createAbsent(req, res) {
  try {
    const { humanId, start_date, last_date } = req.body;

    const absent = await absentService.createAbsent(humanId, start_date, last_date);

    return res.status(201).json(absent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function endAbsentHandler(req, res) {
  try {
    const { humanId, start_date, last_date } = req.body;

    const absent = await absentService.endAbsent(humanId, start_date, last_date);

    return res.status(201).json(absent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAbsentsByHousehold(req, res) {
  try {
    const { householdId } = req.params;
    const { startDate, endDate, limit, offset } = req.query;

    const absents = await absentService.getAbsentsByHousehold(
      householdId,
      startDate,
      endDate,
      limit ? Number(limit) : null,
      offset ? Number(offset) : null
    );

    return res.json(absents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAllAbsentsByHousehold(req, res) {
  try {
    const { householdId } = req.params;

    const absents = await absentService.getAllAbsentsByHousehold(householdId);

    return res.json(absents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default {
  createAbsent,
  getAbsentsByHousehold,
  getAllAbsentsByHousehold,
  endAbsentHandler,
};
