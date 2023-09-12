'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_menus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10)
      },
      roleId: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        },
      },
      menuId: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: 'menus',
          key: 'id'
        },
      },
      isActive: {
        type: Sequelize.STRING(1)
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
    await queryInterface.dropTable('role_menus');
  }
};