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
    userId: {
      type: DataTypes.INTEGER,
      field: 'userId' // Atur nama kolom sesuai yang digunakan di database
    },
    nama: DataTypes.STRING,
    no_telp: DataTypes.INTEGER,
    alamat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'master_pelanggan',
    underscored: true,
  });
  
  master_pelanggan.beforeDestroy(async (masterPelanggan, options) => {
    const id_pelanggan = masterPelanggan.id;
  
    try {
      await sequelize.models.transaksi_telkom.destroy({
        where: { id_pelanggan },
        ...options,
      });
  
      await sequelize.models.history_telkom.destroy({
        where: { id_pelanggan },
        ...options,
      });
    } catch (error) {
      console.error('Gagal menghapus data terkait:', error);
    }
  });
  return master_pelanggan;
};