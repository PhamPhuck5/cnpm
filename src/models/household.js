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
      this.belongsTo(models.Room, {
        foreignKey: "room",
        targetKey: "room",
        scope: {
          apartment_id: sequelize.col("Household.apartment_id"),
        },
        constraints: false, // turn of sequelize check pk constrain Sequelize
      });
    }
  }

  Household.init(
    {
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      room: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },

      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      leave_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      number_motorbike: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      number_car: {
        type: DataTypes.TINYINT,
        allowNull: true,
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
