'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi_nasabah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaksi_nasabah.init({
    norek: DataTypes.INTEGER,
    tanggal: DataTypes.DATE,
    status: DataTypes.STRING,
    uang: DataTypes.INTEGER,
    status_ket: DataTypes.INTEGER,
    norek_dituju: DataTypes.INTEGER,
    no_tlp: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaksi_nasabah',
    underscored: true,
  });
  return transaksi_nasabah;
};