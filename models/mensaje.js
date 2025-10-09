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
      this.belongsTo(models.Chat, { foreignKey: 'chatId' });

      //Relación con usuario

      this.hasOne(models.MensajeTexto, { foreignKey: 'id' });

      this.hasOne(models.MensajeImagen, { foreignKey: 'id' });
    }
  }
  Mensaje.init({
    fechaEnviado: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Mensaje',
  });
  return Mensaje;
};