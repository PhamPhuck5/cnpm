// controllers/absentController.js
import residentRecordService from "../services/baseService/residentRecordService.js";

async function handleCreateResidenceRecord(req, res) {
  try {
    const { humanId, start_date, last_date, isAbsent } = req.body;

    const absent = await residentRecordService.createResidenceRecord(humanId, start_date, last_date, isAbsent);

    return res.status(201).json(absent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
async function handleEndResidentRecordHandler(req, res) {
  try {
    const { record_id, humanId, start_date, last_date } = req.body;
    let absent;
    if (record_id) {
      absent = await residentRecordService.endRecordById(record_id, last_date);
    } else {
      absent = await residentRecordService.endRecord(humanId, start_date, last_date);
    }
    return res.status(201).json(absent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getRecordsByHousehold(req, res) {
  try {
    const { householdId } = req.params;
    const { startDate, endDate, limit, offset } = req.query;

    const absents = await residentRecordService.getRecordsByHousehold(
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

async function getAllRecordsByHousehold(req, res) {
  try {
    const { householdId } = req.params;

    const absents = await residentRecordService.getAllRecordByHousehold(householdId);

    return res.json(absents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default {
  handleCreateResidenceRecord,
  handleEndResidentRecordHandler,
  getRecordsByHousehold,
  getAllRecordsByHousehold,
};
