// models/user.js
import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      // define association here

      this.hasMany(models.Bill, {
        foreignKey: "user_create",
      });
      this.hasMany(models.Payment, {
        foreignKey: "collector",
      });
      this.belongsTo(models.Apartment, {
        foreignKey: "apartment_id",
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phonenumber: {
        type: DataTypes.CHAR(11),
        allowNull: false,
        validate: {
          len: [10, 11],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        index: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );

  return User;
};
