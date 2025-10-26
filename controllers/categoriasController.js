const categoriasDAO = require('../dataAccess/categoriasDAO.js');
const { AppError } = require('../utils/appError.js');

/**
 * Controlador para las operaciones relacionadas con categorías.
 *
 * Encapsula los handlers (métodos) que responden a las rutas HTTP relacionadas
 * con la creación y obtención de categorías. Cada método está pensado para ser
 * usado como middleware/handler de Express: recibe los objetos (req, res, next).
 *
 * Errores esperados: los errores durante el acceso a datos se envían al siguiente
 * middleware de error mediante `next(new AppError(...))`.
 */
class CategoriasController {

    constructor() { }

    /**
     * Handler para crear una nueva categoría.
     *
     * - Valida que el campo `nombre` exista en `req.body`.
     * - Invoca al DAO para crear la categoría y responde con el objeto creado.
     * - En caso de error, pasa un `AppError` al middleware de errores.
     *
     * @param {import('express').Request} req - Objeto request de Express. Se espera `req.body.nombre`.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y el objeto de la categoría creada.
     */
    async crearCategoria(req, res, next) {
        try {
            const {nombre} = req.body;
            if (!nombre) {
                next(new AppError('El campo nombre es obligatorio.', 400));
            }

            const categoriaCreada = await categoriasDAO.crearCategoria(nombre);
            res.status(200).json(categoriaCreada);
        } catch (error) {
            next(new AppError('Ocurrió un error al crear la categoría.', 500));
        }
    }

    /**
     * Handler para obtener la lista de categorías.
     *
     * - Llama al DAO para recuperar las categorías y responde con la lista.
     * - En caso de error, pasa un `AppError` al middleware de errores.
     *
     * @param {import('express').Request} req - Objeto request de Express.
     * @param {import('express').Response} res - Objeto response de Express.
     * @param {import('express').NextFunction} next - Función next de Express para pasar errores.
     * @returns {Promise<void>} Responde con status 200 y un array de categorías.
     */
    async obtenerCategorias(req, res, next) {
        try {
            const categoriasObtenidas = await categoriasDAO.obtenerCategorias();
            res.status(200).json(categoriasObtenidas);
        } catch (error) {
            next(new AppError('Ocurrió un error al obtener las categorías.', 500));
        }
    }

}

module.exports = new CategoriasController();