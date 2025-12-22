import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Absent extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Human, {
        foreignKey: "humanId",
      });
    }
  }

  Absent.init(
    {
      humanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      last_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Absent",
      tableName: "absents",
    }
  );

  return Absent;
};
