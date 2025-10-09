'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImagenesPublicacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ImagenesPublicacion.belongsTo(models.Publicacion, { foreignKey: "idPublicacion" });
    }
  }
  ImagenesPublicacion.init({
    url: DataTypes.STRING,
    idPublicacion: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ImagenesPublicacion',
  });
  return ImagenesPublicacion;
};