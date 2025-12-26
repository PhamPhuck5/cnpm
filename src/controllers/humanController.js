// controllers/humanController.js
import humanService from "../services/baseService/humanService.js";

async function createHuman(req, res) {
  try {
    const { household_id, name, phonenumber, email, dateOfBirth, role } = req.body;

    const human = await humanService.createHuman(household_id, name, phonenumber, email, dateOfBirth, role);

    return res.status(201).json(human);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

async function setLivingFalse(req, res) {
  try {
    const { humanId } = req.params;

    await humanService.setLivingFalse(humanId);

    return res.json({ message: "Human set to not living" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
async function setLivingTrue(req, res) {
  try {
    const { humanId } = req.params;

    await humanService.setLivingTrue(humanId);

    return res.json({ message: "Human set to living" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAllByHousehold(req, res) {
  try {
    const { householdId } = req.params;

    const humans = await humanService.getAllByHousehold(householdId);

    return res.json(humans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
async function getAllInApartment(req, res) {
  try {
    const userId = req.user.id;

    const humans = await humanService.getAllHumansByApartmentId(userId);

    return res.json(humans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
async function getByName(req, res) {
  try {
    const { name } = req.params;
    const userId = req.user.id;

    const humans = await humanService.getHumanByName(name, userId);

    return res.json(humans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getLivingByHousehold(req, res) {
  try {
    const { householdId } = req.params;

    const humans = await humanService.getLivingByHousehold(householdId);

    return res.json(humans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default {
  createHuman,
  setLivingFalse,
  setLivingTrue,
  getAllInApartment,
  getAllByHousehold,
  getLivingByHousehold,
  getByName,
};
