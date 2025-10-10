const { Categoria } = require('../models')

class CategoriasDAO {

    constructor() { }

    async crearCategoria(nombre) {
        try {
            const categoriaCreada = await Categoria.create({ nombre });
            return categoriaCreada;
        } catch (error) {
            throw error;
        }
    }

    async obtenerCategorias() {
        try {
            const categoriasObtenidas = await Categoria.findAll();
            return categoriasObtenidas;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new CategoriasDAO();