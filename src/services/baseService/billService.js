import db from "../../models/index.js";
import authServices from "./authServices.js";

async function createNewBill(creatorId, name, last_date, based = null) {
  let creator = authServices.findUserByID(creatorId);
  const newBill = await db.Bill.create({
    name: name,
    apartment_id: creator.apartment_id,
    phonenumber: newUserData.phonenumber,
    based: based,
    start_date: new Date(),
    last_date: new Date(last_date),
    user_create: creator.id,
  });
  return newBill;
}
async function findBillByID(id) {
  const bill = await db.Bill.findOne({
    where: { id: id },
  });
  return bill;
}
async function checkPermission(billId, userId) {
  let bill = await findBillByID(billId);
  let user = await authServices.findUserByID(userId);
  return bill.apartment_id == user.apartment_id;
}
const billServices = {
  createNewBill: createNewBill,
  checkPermission: checkPermission,
};
export default billServices;
