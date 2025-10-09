'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UsuarioChat.belongsTo(models.Usuario, { foreignKey: 'idUsuario' });
      UsuarioChat.belongsTo(models.Chat, { foreignKey: 'idChat' });//Revisar si es belongsTo o hasMany
    }
  }
  UsuarioChat.init({
    idUsuario: DataTypes.INTEGER,
    idChat: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsuarioChat',
    tableName: 'UsuarioChats'
  });
  return UsuarioChat;
};