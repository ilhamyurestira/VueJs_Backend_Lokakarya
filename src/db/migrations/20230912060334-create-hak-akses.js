'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hak_akses', {
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
      roleId: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        },
      },
      programName: {
        type: Sequelize.STRING(100)
      },
      createdBy: {
        type: Sequelize.STRING(100)
      },
      updatedBy: {
        type: Sequelize.STRING(100)
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
    await queryInterface.dropTable('hak_akses');
  }
};