'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tạo bảng Apartments (Tòa nhà) trước
    await queryInterface.createTable('Apartments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: { type: Sequelize.STRING },
      address: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 2. Tạo bảng Users (Người dùng/Admin)
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      role: { type: Sequelize.STRING, defaultValue: 'admin' },
      phone: { type: Sequelize.STRING },
      avatar: { type: Sequelize.STRING },
      // Quan trọng: Link tới tòa nhà
      apartment_id: { type: Sequelize.INTEGER }, 
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 3. Tạo bảng Households (Hộ khẩu)
    await queryInterface.createTable('Households', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      head_name: { type: Sequelize.STRING }, // Chủ hộ (dự phòng)
      apartment_id: { type: Sequelize.INTEGER },
      room: { type: Sequelize.STRING }, // Tên phòng (P101...)
      number_motorbike: { type: Sequelize.INTEGER, defaultValue: 0 },
      number_car: { type: Sequelize.INTEGER, defaultValue: 0 },
      start_date: { type: Sequelize.DATE },
      leave_date: { type: Sequelize.DATE },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Households');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Apartments');
  }
};