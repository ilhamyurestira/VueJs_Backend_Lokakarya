'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaksi_telkoms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10)
      },
      id_pelanggan: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: 'master_pelanggans',
          key: 'id'
        },
      },
      bulan_tagihan: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
      },
      tahun_tagihan: {
        type: Sequelize.INTEGER(4)
      },
      uang: {
        type: Sequelize.INTEGER(8)
      },
      status: {
        type: Sequelize.INTEGER(1)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      schema: 'ogya_training' // Tambahkan opsi schema di sini
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaksi_telkoms');
  }
};