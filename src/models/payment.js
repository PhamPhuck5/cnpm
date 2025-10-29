// models/user.js
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Payment extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Household, {
        foreignKey: "household_id",
      });
      this.belongsTo(models.Bill, {
        foreignKey: "bill_id",
      });
      this.belongsTo(models.User, {
        foreignKey: "collector",
      });
    }
  }

  Payment.init(
    {
      household_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      collector: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
    }
  );

  return Payment;
};
