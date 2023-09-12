'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class master_pelanggan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  master_pelanggan.init({
    userId: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    no_telp: DataTypes.INTEGER,
    alamat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'master_pelanggan',
    underscored: true,
  });
  return master_pelanggan;
};