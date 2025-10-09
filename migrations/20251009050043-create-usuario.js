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
        allowNull: false,
        type: Sequelize.STRING
      },
      apellidoPaterno: {
        allowNull: false,
        type: Sequelize.STRING
      },
      apellidoMaterno: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fechaNacimiento: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      ciudad: {
        allowNull: false,
        type: Sequelize.STRING
      },
      correo: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      contrasenia: {
        allowNull: false,
        type: Sequelize.STRING
      },
      telefono: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      fotoPerfil: {
        allowNull: true,
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
