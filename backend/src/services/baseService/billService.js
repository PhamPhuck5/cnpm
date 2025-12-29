import db from "../../models/index.js";
import authServices from "./authServices.js";
import { calculateRequiredAmount } from "../../utils/getPaymentValue.js";

async function createNewBill(creatorId, name, start_date, last_date, amount, based = null) {
  const transaction = await db.sequelize.transaction();

  try {
    let creator = await authServices.findUserByID(creatorId);

    // 1. Tạo Bill mới
    const newBill = await db.Bill.create(
      {
        name: name,
        apartment_id: creator.apartment_id,
        based: based,
        amount: amount,
        start_date: start_date ? new Date(start_date) : new Date(),
        last_date: new Date(last_date),
        user_create: creator.id,
      },
      { transaction }
    );

    const activeHouseholds = await db.Household.findAll({
      where: {
        apartment_id: creator.apartment_id,
        leave_date: null,
      },
      include: [
        {
          model: db.Room,
          attributes: ['area', 'room', 'feePerMeter'],
          required: true,
        }
      ],
      transaction,
    });

    const paymentPromises = activeHouseholds.map((household) => {
      console.log(`Hộ: ${household.id} | Phòng: ${household.Room?.room} | Giá riêng: ${household.Room?.feePerMeter}`);
      const requiredAmount = calculateRequiredAmount(newBill, household);

      return db.Payment.create(
        {
          household_id: household.id,
          bill_id: newBill.id,
          date: null,
          amount: 0,
          require: requiredAmount,
          collector: null,
        },
        { transaction }
      );
    });

    await Promise.all(paymentPromises);

    await transaction.commit();
    return newBill;
  } catch (error) {
    await transaction.rollback();
    console.error("Lỗi khi tạo bill và payments:", error);
    throw error;
  }
}

export async function findBillByID(id, userId) {
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

  return bills.map(bill => bill.get({ plain: true }));
}

async function deleteBill(billId, userId) {
  const hasPermission = await checkPermission(billId, userId);
  if (!hasPermission) {
    throw new Error("User does not have permission to delete this bill");
  }

  const transaction = await db.sequelize.transaction();
  try {
    await db.Payment.destroy({
      where: { bill_id: billId },
      transaction,
    });

    await db.Bill.destroy({
      where: { id: billId },
      transaction,
    });

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting bill and associated payments:", error);
    throw error;
  }
}

const billServices = {
  createNewBill: createNewBill,
  getAllBillsOfApartment: getAllBillsOfApartment,
  checkPermission: checkPermission,
  findBillByID,
  deleteBill,
};
export default billServices;