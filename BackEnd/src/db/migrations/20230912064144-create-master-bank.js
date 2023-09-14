'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('master_banks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10)
      },
      userId: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
      },
      nama: {
        type: Sequelize.STRING(20)
      },
      alamat: {
        type: Sequelize.STRING(30)
      },
      norek: {
        type: Sequelize.INTEGER(7),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      noTlp: {
        type: Sequelize.STRING(25)
      },
      saldo: {
        type: Sequelize.INTEGER(12)
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
    await queryInterface.dropTable('master_banks');
  }
};