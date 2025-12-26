import { Op, literal } from "sequelize";
import db from "../models/index.js";

/**
 * Lấy tất cả room theo apartment
 */
export async function getRoomsByApartment(apartmentId) {
  return await db.Room.findAll({
    where: { apartment_id: apartmentId },
    order: [["room", "ASC"]],
  });
}

/**
 * Lấy các room đang có hộ gia đình sống
 * (household.leave_date = null)
 */
export async function getOccupiedRooms(apartmentId) {
  return await db.Room.findAll({
    where: { apartment_id: apartmentId },
    include: [
      {
        model: db.Household,
        required: true,
        where: {
          leave_date: null,
        },
      },
    ],
    order: [["room", "ASC"]],
  });
}

/**
 * Lấy các room trống
 * (không có household nào leave_date = null)
 */
export async function getEmptyRooms(apartmentId) {
  return await db.Room.findAll({
    where: {
      apartment_id: apartmentId,
      [Op.not]: literal(`EXISTS (
        SELECT 1 FROM households h
        WHERE h.room = Room.room
          AND h.apartment_id = Room.apartment_id
          AND h.leave_date IS NULL
      )`),
    },
    order: [["room", "ASC"]],
  });
}
