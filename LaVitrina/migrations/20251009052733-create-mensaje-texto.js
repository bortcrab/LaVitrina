'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MensajesTexto', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Mensajes',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      texto: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MensajeTextos');
  }
};