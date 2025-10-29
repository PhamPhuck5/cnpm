import billServices from "../services/baseService/billService.js";
let handleCreateBill = async (req, res) => {
  try {
    let creatorId = req.user.id;
    let name = req.body.email;
    let last_date = req.body.last_date;
    let based = req.body.based;
    let newBill = await billServices.createNewBill(
      creatorId,
      name,
      last_date,
      based
    );
    return res.status(200).json({
      status: 200,
      message: "create bill success",
      data: {
        name: name,
        last_date: last_date,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};
