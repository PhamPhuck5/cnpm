import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Human extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Household, {
        foreignKey: "household_id",
      });
      this.hasMany(models.Absent, {
        foreignKey: "humanId",
      });
    }
  }

  Human.init(
    {
      household_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      phonenumber: {
        type: DataTypes.CHAR(11),
        allowNull: true,
        validate: {
          len: [10, 11],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        index: true,
        validate: {
          isEmail: true,
        },
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      living: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Human",
      tableName: "humans",
    }
  );

  return Human;
};
