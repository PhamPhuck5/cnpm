import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class ResidenceRecords extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Human, {
        foreignKey: "humanId",
      });
    }
  }

  ResidenceRecords.init(
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
        allowNull: true,
      },
      is_absent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "ResidenceRecord",
      tableName: "residence_records",
    }
  );

  return ResidenceRecords;
};
