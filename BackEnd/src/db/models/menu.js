'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.role);
    }
  }
  menu.init(
    {
      nama: DataTypes.STRING,
      icon: DataTypes.STRING,
      url: DataTypes.STRING,
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
      modelName: 'menu',
      underscored: true,
    }
  );
  return menu;
};
