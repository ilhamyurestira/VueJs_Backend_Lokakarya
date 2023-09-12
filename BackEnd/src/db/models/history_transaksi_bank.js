'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class history_transaksi_bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  history_transaksi_bank.init({
    norek: DataTypes.INTEGER,
    tanggal: DataTypes.DATE,
    uang: DataTypes.INTEGER,
    status_ket: DataTypes.INTEGER,
    norek_dituju: DataTypes.INTEGER,
    no_tlp: DataTypes.INTEGER,
    nama: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'history_transaksi_bank',
    underscored: true,
  });
  return history_transaksi_bank;
};