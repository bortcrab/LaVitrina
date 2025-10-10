// Importa el modelo de categorías
const { Categoria } = require('../models')

/**
 * Clase para gestionar operaciones relacionadas con categorías, como creación y obtención.
 */
class CategoriasDAO {

    /**
     * Constructor de la clase CategoriasDAO.
     * Inicializa la instancia para gestionar operaciones de categorías.
     */
    constructor() { }

    /**
     * Crea una nueva categoría en la base de datos.
     * 
     * @param {string} nombre - Nombre de la categoría.
     * @returns {Promise<Categoria>} La categoría creada.
     * @throws {Error} Si ocurre un error al crear la categoría.
     */
    async crearCategoria(nombre) {
        try {
            const categoriaCreada = await Categoria.create({ nombre });
            return categoriaCreada;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todas las categorías existentes en la base de datos.
     * 
     * @returns {Promise<Categoria[]>} Lista de categorías obtenidas.
     * @throws {Error} Si ocurre un error al obtener las categorías.
     */
    async obtenerCategorias() {
        try {
            const categoriasObtenidas = await Categoria.findAll();
            return categoriasObtenidas;
        } catch (error) {
            throw error;
        }
    }

}

//Se exporta la clase CategoriasDAO
module.exports = new CategoriasDAO();