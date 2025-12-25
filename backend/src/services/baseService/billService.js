import db from "../../models/index.js";
import authServices from "./authServices.js";
import { Op } from "sequelize"; // Sửa require thành import cho chuẩn ES6

// 1. TẠO HÓA ĐƠN THỦ CÔNG
// Thêm từ khóa 'export' vào trước hàm
export async function createNewBill(householdId, name, amount, description) {
  const newBill = await db.Bill.create({
    household_id: householdId,
    name: name || "Phí phát sinh",
    total: amount,
    description: description,
    start_date: new Date(),
    status: 'Unpaid',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  return newBill;
}

// 2. TẠO HÓA ĐƠN HÀNG LOẠT
export async function generateMonthlyBills(month, year) {
  const households = await db.Household.findAll();
  const createdBills = [];

  for (const h of households) {
      const exist = await db.Bill.findOne({
          where: { household_id: h.id, month, year }
      });
      if (exist) continue;

      const feeService = h.area * h.feePerMeter; 
      const feeMoto = (h.number_motobike || 0) * 70000;
      const feeCar = (h.number_car || 0) * 1200000;
      const totalAmount = feeService + feeMoto + feeCar;

      const newBill = await db.Bill.create({
          household_id: h.id,
          room: h.room,
          month: month,
          year: year,
          service_fee: feeService,
          vehicle_fee: feeMoto + feeCar,
          total: totalAmount,
          status: 'Unpaid',
      });
      createdBills.push(newBill);
  }
  return createdBills;
}

// 3. ADMIN LẤY TẤT CẢ BILL
export async function getAllBills(status = null) {
  const whereClause = {};
  if (status) whereClause.status = status;

  return await db.Bill.findAll({
    where: whereClause,
    include: [
      {
        model: db.Household,
        attributes: ["id", "room", "type"],
      },
    ],
    order: [
      ["year", "DESC"], 
      ["month", "DESC"]
    ],
  });
}

// 4. USER LẤY BILL CỦA MÌNH
export async function getAllBillsOfApartment(userId) {
  const user = await db.User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const household = await db.Household.findOne({
    where: { apartment_id: user.apartment_id },
    order: [['createdAt', 'DESC']]
  });

  if (!household) return [];

  const bills = await db.Bill.findAll({
    where: {
      household_id: household.id,
    },
    order: [["year", "DESC"], ["month", "DESC"]],
  });

  return bills;
}

// 5. CHI TIẾT BILL
export async function findBillByID(id) {
  const bill = await db.Bill.findOne({
    where: { id: id },
    include: [{ model: db.Household }]
  });
  if (!bill) throw new Error("Bill not found");
  return bill;
}

// 6. CHECK QUYỀN
export async function checkPermission(billId, userId) {
  const bill = await db.Bill.findByPk(billId);
  if (!bill) return false;

  const user = await db.User.findByPk(userId);
  if (!user) return false;

  const householdOfBill = await db.Household.findByPk(bill.household_id);
  
  if (householdOfBill && householdOfBill.apartment_id === user.apartment_id) {
      return true;
  }
  return false;
}

// Object này dùng cho Default Import (import billServices from ...)
const billServices = {
  createNewBill,
  generateMonthlyBills,
  getAllBills,
  getAllBillsOfApartment,
  findBillByID,
  checkPermission
};

export default billServices;