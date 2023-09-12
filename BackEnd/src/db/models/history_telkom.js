'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class history_telkom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  history_telkom.init({
    id_pelanggan: DataTypes.INTEGER,
    tanggal_bayar: DataTypes.DATE,
    bulan_tagihan: DataTypes.INTEGER,
    tahun_tagihan: DataTypes.INTEGER,
    uang: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'history_telkom',
    underscored: true,
  });
  return history_telkom;
};