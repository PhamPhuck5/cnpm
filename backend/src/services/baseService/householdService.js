import db from "../../models/index.js";
import authServices from "./authServices.js";

async function createHousehold(room, number_motobike, number_car, start_date, userId, type, feePerMeter) {
  let creator = await authServices.findUserByID(userId);

  const newHousehold = await db.Household.create({
    room,
    number_motobike,
    number_car,
    start_date: start_date ? new Date(start_date) : new Date(),
    apartment_id: creator.apartment_id,
    type,
    feePerMeter,
  });

  return newHousehold;
}

const getAllHouseholds = async (userId) => {
  try {
      let households = await db.Household.findAll({
        order: [['createdAt', 'DESC']],
        raw: true,  // <--- Thêm dòng này để chắc chắn lấy dữ liệu thô
        nest: true 
      });
      return households;

  } catch (error) {
      console.log("Lỗi tại getAllHouseholds Service:", error);
      throw error;
  }
};

async function getHouseholdDetails(id) {
  // return await db.Household.findOne({
  //   where: { id },
  //   include: [{ model: db.Apartment }, { model: db.Apartment }, { model: db.Human }],
  // });

  // if (household) {
  //   // Chuyển đổi sang object thuần ở đây để an toàn
  //   return household.get({ plain: true });
  // }
  // return null;
  try{
    let household = await db.Household.findOne({
      where: { id },
      include: [
        { model: db.Apartment },
        { model: db.Human }
      ],
      raw: false,
      nest: true
    });
    return household.get({ plain: true });
  } catch (error) {
    console.log("Lỗi tại getHouseholdDetails Service:", error);
    throw error;
  }
}

async function getHouseholdByRoom(room, userId) {
  const user = await db.User.findByPk(userId);

  return await db.Household.findAll({
    where: {
      apartment_id: user.apartment_id,
      room: room,
    },
    include: [
      {
        model: db.Apartment,
      },
    ],
  });
}

export const findHouseholdByUser = getAllHouseholds;
const householdServices = {
  createHousehold: createHousehold,
  getAllHouseholds: getAllHouseholds,
  getHouseholdDetails: getHouseholdDetails,
  findHouseholdByUser: findHouseholdByUser,
  getHouseholdByRoom: getHouseholdByRoom,
};
export default householdServices;
