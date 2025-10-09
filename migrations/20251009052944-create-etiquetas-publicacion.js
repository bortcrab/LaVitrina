'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EtiquetasPublicaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      etiqueta: {
        type: Sequelize.STRING,
        allowNull: false
      },
      idPublicacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Publicaciones',
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
    await queryInterface.dropTable('EtiquetasPublicaciones');
  }
};