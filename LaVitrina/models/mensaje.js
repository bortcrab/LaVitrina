'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mensaje extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Chat, { foreignKey: 'idChat' });
      this.belongsTo(models.Usuario, { foreignKey: 'idUsuario' });
      this.hasOne(models.MensajeTexto, { foreignKey: 'id', onDelete: 'CASCADE' });
      this.hasOne(models.MensajeImagen, { foreignKey: 'id', onDelete: 'CASCADE' });
    }
  }
  Mensaje.init({
    fechaEnviado: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Mensaje',
    tableName: 'Mensajes'
  });
  return Mensaje;
};