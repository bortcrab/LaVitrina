'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subasta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Cada subasta es una publicación
      Subasta.belongsTo(models.Publicacion, { foreignKey: "id" });
      Subasta.hasMany(models.Puja, { foreignKey: "idSubasta" });
    }
  }
  Subasta.init({
    fechaInicio: DataTypes.DATE,
    fechaFin: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Subasta',
    tableName: 'Subastas'
  });

  return Subasta;
};