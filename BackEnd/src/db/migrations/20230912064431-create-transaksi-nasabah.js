'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaksi_nasabahs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10)
      },
      norek: {
        type: Sequelize.INTEGER(7),
        allowNull: false,
        references: {
          model: 'master_banks',
          key: 'norek'
        },
      },
      tanggal: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      uang: {
        type: Sequelize.INTEGER(12),
        allowNull: false,
      },
      status_ket: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
      },
      norek_dituju: {
        type: Sequelize.INTEGER(7)
      },
      no_tlp: {
        type: Sequelize.INTEGER(9)
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
    await queryInterface.dropTable('transaksi_nasabahs');
  }
};