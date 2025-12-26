// models/user.js
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Room extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Apartment, {
        foreignKey: "apartment_id",
      });
    }
  }

  Room.init(
    {
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      room: {
        type: DataTypes.STRING(8),
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      area: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0.0,
      },
      feePerMeter: {
        //todo: an api for user to change this by type
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Room",
      tableName: "rooms",
    }
  );

  return Room;
};
