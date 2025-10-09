'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.hasMany(models.Mensaje, { foreignKey: 'idUsuario' });
      Usuario.hasMany(models.Publicacion, { foreignKey: 'idUsuario' });
      //Usuario.hasMany(models.Puja, { foreignKey: 'usuarioId' });
      //Usuario.hasMany(models.Resenia, { foreignKey: 'usuarioId' });
      Usuario.hasMany(models.Chat, { foreignKey: 'idUsuario' });
    }
  }
  Usuario.init({
    nombres: DataTypes.STRING,
    apellidoPaterno: DataTypes.STRING,
    apellidoMaterno: DataTypes.STRING,
    fechaNacimiento: DataTypes.DATEONLY,
    ciudad: DataTypes.STRING,
    correo: DataTypes.STRING,
    contrasenia: DataTypes.STRING,
    telefono: DataTypes.STRING,
    fotoPerfil: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};