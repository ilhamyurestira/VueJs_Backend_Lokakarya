'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.hak_akses);
    }
  }
  user.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      nama: DataTypes.STRING,
      alamat: DataTypes.STRING,
      email: DataTypes.STRING,
      telp: DataTypes.STRING,
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
      modelName: 'user',
      underscored: true,
    }
  );

  // Tambahkan hook beforeUpdate
  user.beforeUpdate(async (user, options) => {
    const userId = user.id;
    const { nama, alamat } = user;

    try {
      // Temukan semua entri master_bank yang terkait dengan userId
      const masterBanks = await sequelize.models.master_bank.findAll({ where: { userId } });

      // Update nama, alamat, dan noTlp pada setiap entri master_bank
      for (const masterBank of masterBanks) {
        await masterBank.update({ nama, alamat }, options);
      }
    } catch (error) {
      console.error('Gagal mengupdate data master_bank:', error);
    }
  });
  return user;
};
