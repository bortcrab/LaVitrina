'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //this.hasMany(models.Mensaje, { foreignKey: 'IdChat' });
      this.belongsTo(models.Publicacion, { foreignKey: 'idPublicacion' });
      Chat.belongsToMany(models.Usuario, { through: models.UsuarioChat, foreignKey: 'idChat' });
    }
  }
  Chat.init({
    nombre: DataTypes.STRING,
    fechaCreacion: DataTypes.DATEONLY,
    idPublicacion: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'Chats'
  });
  return Chat;
};