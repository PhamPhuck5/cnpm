import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Bill extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user_create",
      });
      this.belongsTo(models.Apartment, {
        foreignKey: "apartment_id",
      });
      this.hasMany(models.Payment, {
        foreignKey: "bill_id",
      });
    }
  }

  Bill.init(
    {
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      //payment = amount * based,
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      based: {
        type: DataTypes.STRING(16),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      last_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      user_create: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Bill",
      tableName: "bills",
    }
  );

  return Bill;
};