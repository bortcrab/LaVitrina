'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publicacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Publicacion.belongsTo(models.Categoria, { foreignKey: "idCategoria" });
      Publicacion.belongsTo(models.Usuario, { foreignKey: 'idUsuario' });
      Publicacion.hasMany(models.ImagenesPublicacion, { foreignKey: "idPublicacion" });
      Publicacion.hasMany(models.EtiquetasPublicacion, { foreignKey: "idPublicacion" });
      Publicacion.hasMany(models.Chat, { foreignKey: "idPublicacion" });
      Publicacion.hasOne(models.Subasta, { foreignKey: "id" });
    }
  }
  Publicacion.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    fechaPublicacion: DataTypes.DATE,
    precio: DataTypes.DECIMAL,
    estado: DataTypes.STRING,
    idCategoria: DataTypes.INTEGER,
    idUsuario: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Publicacion',
    tableName: 'Publicaciones'
  });
  return Publicacion;
};