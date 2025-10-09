'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombres: {
        type: Sequelize.STRING
      },
      apellidoPaterno: {
        type: Sequelize.STRING
      },
      apellidoMaterno: {
        type: Sequelize.STRING
      },
      fechaNacimiento: {
        type: Sequelize.DATEONLY
      },
      ciudad: {
        type: Sequelize.STRING
      },
      correo: {
        type: Sequelize.STRING
      },
      contrasenia: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      fotoPerfil: {
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
    await queryInterface.dropTable('Usuarios');
  }
};