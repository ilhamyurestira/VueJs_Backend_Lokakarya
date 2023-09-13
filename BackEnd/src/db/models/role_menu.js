'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role_menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  role_menu.init(
    {
      roleId: DataTypes.INTEGER,
      menuId: DataTypes.INTEGER,
      isActive: DataTypes.STRING,
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
      modelName: 'role_menu',
      underscored: true,
    }
  );
  return role_menu;
};
