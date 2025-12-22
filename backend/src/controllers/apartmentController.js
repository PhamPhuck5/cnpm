import apartmentServices from "../services/baseService/apartmentService.js";

const handleCreateApartment = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Missing required parameter: name",
      });
    }

    const newApartment = await apartmentServices.createNewApartment(name, address);

    return res.status(201).json({
      message: "Create apartment success",
      data: newApartment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleGetAllApartments = async (req, res) => {
  try {
    const apartments = await apartmentServices.getAllApartments();
    return res.status(200).json({
      message: "Get all apartments success",
      data: apartments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default {
  handleCreateApartment,
  handleGetAllApartments,
};
