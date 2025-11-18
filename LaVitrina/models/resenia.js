'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resenia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Resenia.belongsTo(models.Usuario, { foreignKey: 'idUsuarioReseniado', as: 'UsuarioReseniado' });
      Resenia.belongsTo(models.Usuario, { foreignKey: 'idUsuarioCreador', as: 'UsuarioCreador' });
    }
  }
  Resenia.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    calificacion: DataTypes.INTEGER,
    fechaResenia: DataTypes.DATE,
    idUsuarioReseniado: DataTypes.INTEGER,
    idUsuarioCreador: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Resenia',
    tableName: 'Resenias'
  });

  return Resenia;
};