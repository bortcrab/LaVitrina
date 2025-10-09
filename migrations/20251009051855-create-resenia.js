'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Resenias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      descripcion: {
        allowNull: false,
        type: Sequelize.STRING
      },
      calificacion: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      fechaResenia: {
        allowNull: false,
        type: Sequelize.DATE
      },
      idUsuarioCreador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'Usuarios',
          key: 'id'
        }
      },
      idUsuarioReseniado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'Usuarios',
          key: 'id'
        }
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
    await queryInterface.dropTable('Resenias');
  }
};