'use strict';
const PASS = '$2a$10$R/..q/..'; // Bạn có thể thay bằng chuỗi hash thật của bạn nếu cần

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Tạo Tòa nhà số 3 (Để khớp với dữ liệu phòng bạn đã tạo)
    await queryInterface.bulkInsert('Apartments', [{
      id: 3,
      name: 'Chung cư Demo',
      address: 'Hà Nội',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // 2. Tạo User Admin quản lý tòa nhà số 3
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      password: '$2a$10$p0/..', // Hash của '123456' (hoặc copy từ DB cũ của bạn)
      role: 'admin',
      apartment_id: 3, // <--- QUAN TRỌNG: Phải là 3 mới nhìn thấy phòng
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Apartments', null, {});
  }
};