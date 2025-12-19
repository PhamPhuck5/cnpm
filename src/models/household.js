// models/user.js
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Household extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.Payment, {
        foreignKey: "household_id",
      });
      this.hasMany(models.Human, {
        foreignKey: "household_id",
      });
      this.belongsTo(models.Apartment, {
        foreignKey: "apartment_id",
      });
    }
  }

  Household.init(
    {
      room: {
        //todo: add index this and apartment_id
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      feePerMeter: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      number_motobike: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      number_car: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Household",
      tableName: "households",
    }
  );

  return Household;
};
