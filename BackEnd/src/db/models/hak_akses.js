'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hak_akses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.role, { foreignKey: 'roleId' });
      this.belongsTo(models.user, { foreignKey: 'userId' });
    }
  }
  hak_akses.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: 'userId',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        field: 'roleId',
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      programName: {
        type: DataTypes.STRING,
        field: 'programName', // Atur nama kolom sesuai yang digunakan di database
      },
      createdBy: {
        type: DataTypes.STRING,
        field: 'createdBy', // Atur nama kolom sesuai yang digunakan di database
      },
      updatedBy: {
        type: DataTypes.STRING,
        field: 'updatedBy', // Atur nama kolom sesuai yang digunakan di database
      },
    },
    {
      sequelize,
      modelName: 'hak_akses',
      underscored: true,
    }
  );
  return hak_akses;
};
