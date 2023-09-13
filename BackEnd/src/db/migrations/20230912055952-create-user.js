'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'users',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER(10),
        },
        username: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        nama: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        alamat: {
          type: Sequelize.STRING(100),
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        telp: {
          type: Sequelize.STRING(25),
          allowNull: false,
        },
        programName: {
          type: Sequelize.STRING(100),
        },
        createdBy: {
          type: Sequelize.STRING(100),
        },
        updatedBy: {
          type: Sequelize.STRING(100),
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        schema: 'ogya_training', // Tambahkan opsi schema di sini
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
