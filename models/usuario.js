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
      Usuario.hasMany(models.Puja, { foreignKey: 'idUsuario' });
      Usuario.hasMany(models.Resenia, { foreignKey: 'idUsuarioReseniado', as: 'reseniasRecibidas' });
      Usuario.hasMany(models.Resenia, { foreignKey: 'idUsuarioCreador', as: 'reseniasCreadas' });
      Usuario.belongsToMany(models.Chat, { through: models.UsuarioChat, foreignKey: 'idUsuario' });
    }

    toJSON() {
      const attributes = { ...this.get() };
      delete attributes.contrasenia; 
      return attributes;
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
    tableName: 'Usuarios'
  });
  return Usuario;
};