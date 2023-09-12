'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi_telkom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaksi_telkom.init({
    id_pelanggan: DataTypes.INTEGER,
    bulan_tagihan: DataTypes.INTEGER,
    tahun_tagihan: DataTypes.INTEGER,
    uang: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaksi_telkom',
    underscored: true,
  });
  return transaksi_telkom;
};