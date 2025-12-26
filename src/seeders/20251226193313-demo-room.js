"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const rooms = [];
    const apartmentId = 1; // Giả định ID chung cư là 1

    for (let floor = 1; floor <= 30; floor++) {
      if (floor === 1) {
        // Tầng 1: Kiot - Chia làm 5 kiot, mỗi cái 90m2
        for (let i = 1; i <= 5; i++) {
          rooms.push({
            apartment_id: apartmentId,
            room: `${floor}0${i}`,
            type: "Kiot",
            area: 90,
            feePerMeter: 20000,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else if (floor >= 2 && floor <= 5) {
        // 4 tầng đế: Văn phòng/Thương mại - Chia làm 2 phòng lớn, mỗi cái 225m2
        for (let i = 1; i <= 2; i++) {
          rooms.push({
            apartment_id: apartmentId,
            room: `${floor}0${i}`,
            type: "Tầng đế",
            area: 225,
            feePerMeter: 15000,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else if (floor >= 6 && floor <= 29) {
        // 24 tầng nhà ở: Chia làm 6 căn hộ mỗi tầng, mỗi căn 75m2
        for (let i = 1; i <= 6; i++) {
          rooms.push({
            apartment_id: apartmentId,
            room: `${floor}${i < 10 ? "0" + i : i}`,
            type: "Nhà ở",
            area: 75,
            feePerMeter: 10000,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else if (floor === 30) {
        // 1 tầng Penthouse: 1 căn duy nhất chiếm trọn sàn 450m2
        rooms.push({
          apartment_id: apartmentId,
          room: `3001`,
          type: "Penthouse",
          area: 450,
          feePerMeter: 30000,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Tên bảng là 'households' theo định nghĩa trong room.js
    return queryInterface.bulkInsert("households", rooms);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("households", null, {});
  },
};
