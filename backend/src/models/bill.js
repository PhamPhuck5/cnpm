import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Bill extends Model {
    static associate(models) {
      // Bill thuộc về 1 Hộ Khẩu (Household)
      this.belongsTo(models.Household, {
        foreignKey: "household_id",
      });
      
      // Bill có thể có nhiều lần thanh toán (trả góp hoặc trả hết)
      this.hasMany(models.Payment, {
        foreignKey: "bill_id",
      });
    }
  }

  Bill.init(
    {
      // ID Hộ khẩu (Khóa ngoại quan trọng nhất)
      household_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Lưu thêm số phòng (room) để hiển thị nhanh đỡ phải join bảng nhiều
      room: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      // Tháng thu phí (1-12)
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Năm thu phí (2025...)
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Chi tiết tiền: Phí dịch vụ (Diện tích * giá)
      service_fee: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // Chi tiết tiền: Phí gửi xe (Xe máy + Ô tô)
      vehicle_fee: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // Tổng tiền phải đóng ( service_fee + vehicle_fee + khác...)
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // Trạng thái: 'Paid' (Đã đóng), 'Unpaid' (Chưa đóng)
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "Unpaid",
      },
      // Tên đợt thu (Ví dụ: "Phí tháng 12", hoặc "Ủng hộ bão lụt")
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // Mô tả thêm nếu cần
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "Bill",
      tableName: "bills",
    }
  );

  return Bill;
};