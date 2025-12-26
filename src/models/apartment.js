// models/user.js
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Apartment extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.Bill, {
        foreignKey: "apartment_id",
      });
      this.hasMany(models.User, {
        foreignKey: "apartment_id",
      });
      this.hasMany(models.Household, {
        foreignKey: "apartment_id",
      });
    }
  }

  Apartment.init(
    {
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      area: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0.0,
      },
      number_floors: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Apartment",
      tableName: "apartments",
    }
  );

  return Apartment;
};
