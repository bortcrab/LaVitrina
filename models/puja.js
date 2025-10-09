'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Puja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Puja.belongsTo(models.Usuario, { foreignKey: 'idUsuario' });
      Puja.belongsTo(models.Subasta, { foreignKey: 'idSubasta' });
    }
  }
  Puja.init({
    idUsuario: DataTypes.INTEGER,
    idSubasta: DataTypes.INTEGER,
    monto: DataTypes.DECIMAL,
    fechaPuja: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Puja',
    tableName: 'Pujas'
  });
  return Puja;
};