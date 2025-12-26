import db from "../../models/index.js";
import authServices from "./authServices.js";

async function createNewBill(creatorId, name, start_date, last_date, amount, based = null) {
  let creator = await authServices.findUserByID(creatorId);
  const newBill = await db.Bill.create({
    name: name,
    apartment_id: creator.apartment_id,
    based: based,
    amount: amount,
    start_date: start_date ? new Date(start_date) : new Date(),
    last_date: new Date(last_date),
    user_create: creator.id,
  });
  return newBill;
} //todo: create payment àter this
export async function findBillByID(id, userId) {
  if (!(await checkPermission(id, userId))) {
    throw new error("not permission");
  }
  const bill = await db.Bill.findOne({
    where: { id: id },
  });
  return bill;
}

async function checkPermission(billId, userId) {
  const bill = await db.Bill.findOne({
    where: { id: billId },
  });
  let user = await authServices.findUserByID(userId);
  if (!(bill && user)) {
    throw new Error("not found bill or user, on testing if you see this create a bill before find it oke");
  }
  return bill.apartment_id == user.apartment_id;
}
export async function getBillsByApartment(apartmentId) {
  return db.Bill.findAll({
    where: { apartment_id: apartmentId },
    raw: true,
  });
}

async function getAllBillsOfApartment(userId) {
  const user = await db.User.findByPk(userId);

  const bills = await db.Bill.findAll({
    where: {
      apartment_id: user.apartment_id,
    },
    include: [
      {
        model: db.User,
        attributes: ["name"], // Chỉ lấy tên và email, tránh lộ password
      },
    ],
    order: [["start_date", "DESC"]],
  });

  return bills;
}
const billServices = {
  createNewBill: createNewBill,
  getAllBillsOfApartment: getAllBillsOfApartment,
  checkPermission: checkPermission,
};
export default billServices;
