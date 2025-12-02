// Importa el modelo de publicaciones
const { Publicacion } = require('../models');
// Importa el modelo de imágenes asociadas a publicaciones
const { ImagenesPublicacion } = require('../models')
// Importa el modelo de etiquetas asociadas a publicaciones
const { EtiquetasPublicacion } = require('../models')
// Importa el modelo de subastas asociadas a publicaciones
const { Subasta } = require('../models')
// Importa el modelo de categorias asociadas a publicaciones
const { Categoria } = require('../models')
// Importa el modelo de usuarios asociados a publicaciones
const { Usuario } = require('../models')
const { Puja } = require('../models')
const { Chat } = require('../models');
const etiquetasDAO = require('./etiquetasDAO');
const imagenesDAO = require('./imagenesDAO');
// Importa operadores de consulta de Sequelize para búsquedas avanzadas
const { Op } = require('sequelize');

const { sequelize } = require('../models');

/**
 * Clase para gestionar operaciones relacionadas con publicaciones, incluyendo creación,
 * obtención, actualización y eliminación de publicaciones.
 */
class PublicacionesDAO {

    /**
     * Constructor de la clase PublicacionesDAO.
     * Inicializa la instancia para gestionar operaciones de publicaciones.
     */
    constructor() { }

    /**
     * Crea una nueva publicación en la base de datos, junto con sus imágenes y etiquetas asociadas.
     * 
     * @param {string} titulo - Título de la publicación.
     * @param {string} descripcion - Descripción de la publicación.
     * @param {number} precio - Precio de la publicación.
     * @param {string[]} etiquetas - Lista de etiquetas asociadas.
     * @param {string[]} imagenes - Lista de URLs de imágenes asociadas.
     * @param {number} idCategoria - ID de la categoría asociada.
     * @param {number} idUsuario - ID del usuario que crea la publicación.
     * @returns {Promise<Publicacion>} La publicación creada.
     * @throws {Error} Si ocurre un error al crear la publicación.
     */
    async crearPublicacion(publicacionData) {
        const {
            titulo,
            descripcion,
            precio,
            etiquetas,
            imagenes,
            idCategoria,
            idUsuario
        } = publicacionData;
        try {
            const fechaPublicacion = new Date();
            const estado = 'Disponible';

            const publicacionCreada = await Publicacion.create({ titulo, descripcion, fechaPublicacion, precio, estado, idCategoria, idUsuario });
            for (let i = 0; i < imagenes.length; i++) {
                await ImagenesPublicacion.create({ url: imagenes[i], idPublicacion: publicacionCreada.id });
            }
            for (let i = 0; i < etiquetas.length; i++) {
                await EtiquetasPublicacion.create({ etiqueta: etiquetas[i], idPublicacion: publicacionCreada.id });
            }
            return publicacionCreada;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de publicaciones, limitado a 20 resultados.
     * 
     * @returns {Promise<Publicacion[]>} Lista de publicaciones obtenidas.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicaciones(offset) {
        try {
            const publicionesObtenidas = await Publicacion.findAll({
                include: [{
                    model: Subasta,
                    as: "Subastum",
                    include: [{
                        model: Puja,
                        as: "Pujas",
                        separate: true,
                        order: [
                            ['monto', 'DESC']
                        ]
                    }]
                },
                {
                    model: Categoria,
                    as: "Categorium"
                },
                {
                    model: Usuario,
                    as: "Usuario"
                },
                {
                    model: ImagenesPublicacion,
                    as: "ImagenesPublicacions"
                },
                {
                    model: EtiquetasPublicacion,
                    as: "EtiquetasPublicacions"
                }
                ],
                limit: 20,
                offset
            });
            return publicionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una publicación por su ID.
     *
     * @param {number} idPublicacion - ID de la publicación a buscar.
     * @returns {Promise<Publicacion|null>} La publicación encontrada o null si no existe.
     * @throws {Error} Si ocurre un error durante la consulta a la base de datos.
     */
    async obtenerPublicacionPorId(idPublicacion) {
        try {
            const publicacionObtenida = await Publicacion.findOne({
                where: {
                    id: {
                        [Op.eq]: idPublicacion
                    }
                },
                include: [{
                    model: Subasta,
                    as: "Subastum",
                    include: [{
                        model: Puja,
                        as: "Pujas",
                        separate: true,
                        order: [
                            ['monto', 'DESC']
                        ]
                    }]
                },
                {
                    model: Categoria,
                    as: "Categorium"
                },
                {
                    model: Usuario,
                    as: "Usuario"
                },
                {
                    model: ImagenesPublicacion,
                    as: "ImagenesPublicacions"
                },
                {
                    model: EtiquetasPublicacion,
                    as: "EtiquetasPublicacions"
                }
                ]
            });
            return publicacionObtenida;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Obtiene todas las publicaciones asociadas a un usuario específico.
     * 
     * @param {number} idUsuario - ID del usuario cuyas publicaciones se desean obtener.
     * @returns {Promise<Publicacion[]>} Lista de publicaciones encontradas.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicacionesPorUsuario(idUsuario, offset) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    idUsuario: idUsuario,
                },
                include: [{
                    model: Subasta,
                    as: "Subastum"
                },
                {
                    model: Categoria,
                    as: "Categorium"
                },
                {
                    model: Usuario,
                    as: "Usuario"
                },
                {
                    model: ImagenesPublicacion,
                    as: "ImagenesPublicacions"
                },
                {
                    model: EtiquetasPublicacion,
                    as: "EtiquetasPublicacions"
                }
                ],
                distinct: true,
                limit: 20,
                offset
            });
            return publicacionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de publicaciones cuyo título coincide parcialmente con el texto proporcionado.
     * 
     * @param {string} titulo - Texto a buscar en los títulos de las publicaciones.
     * @returns {Promise<Publicacion[]>} Lista de publicaciones encontradas.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicacionesPorTitulo(titulo, offset) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    titulo: {
                        [Op.like]: `%${titulo}%` //Se usa el operador like para los titulos que coincidan con el mandado en el parámetro
                    }
                },
                include: [{
                    model: Subasta,
                    as: "Subastum"
                },
                {
                    model: Categoria,
                    as: "Categorium"
                },
                {
                    model: Usuario,
                    as: "Usuario"
                },
                {
                    model: ImagenesPublicacion,
                    as: "ImagenesPublicacions"
                },
                {
                    model: EtiquetasPublicacion,
                    as: "EtiquetasPublicacions"
                }
                ],
                limit: 20,
                offset
            });
            return publicacionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de publicaciones filtradas por categoría, limitado a 20 resultados.
     * 
     * @param {number} idCategoria - ID de la categoría por la que se filtran las publicaciones.
     * @returns {Promise<Publicacion[]>} Lista de publicaciones encontradas.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicacionesPorCategoria(idCategoria, offset) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    idCategoria: idCategoria
                },
                include: [{
                    model: Subasta,
                    as: "Subastum"
                },
                {
                    model: Categoria,
                    as: "Categorium"
                },
                {
                    model: Usuario,
                    as: "Usuario"
                },
                {
                    model: ImagenesPublicacion,
                    as: "ImagenesPublicacions"
                },
                {
                    model: EtiquetasPublicacion,
                    as: "EtiquetasPublicacions"
                }
                ],
                distinct: true,
                limit: 20,
                offset
            });
            return publicacionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de publicaciones que contienen alguna de las etiquetas especificadas.
     * 
     * @param {string[]} etiquetas - Lista de etiquetas por las que se filtran las publicaciones.
     * @returns {Promise<Publicacion[]>} Lista de publicaciones encontradas.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicacionesPorEtiquetas(etiquetas, offset) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                include: [
                    {
                        model: EtiquetasPublicacion,
                        required: false // Esto hace un LEFT JOIN para obtener TODAS las etiquetas
                    },
                    {
                        model: Subasta,
                        as: "Subastum"
                    },
                    {
                        model: Categoria,
                        as: "Categorium"
                    },
                    {
                        model: Usuario,
                        as: "Usuario"
                    },
                    {
                        model: ImagenesPublicacion,
                        as: "ImagenesPublicacions"
                    }
                ],
                where: {
                    // Filtramos publicaciones que tengan AL MENOS una etiqueta del array
                    id: {
                        [Op.in]: sequelize.literal(`(
                        SELECT DISTINCT idPublicacion
                        FROM etiquetaspublicaciones 
                        WHERE etiqueta IN (${etiquetas.map(e => `'${e}'`).join(',')})
                    )`)
                    }
                },
                limit: 20,
                offset
            });
            return publicacionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene una lista de publicaciones dentro de un periodo de fechas específico.
     * 
     * @param {Date} fechaInicio - Fecha de inicio del periodo.
     * @param {Date} fechaFin - Fecha de fin del periodo.
     * @returns {Promise<Publicacion[]>} Lista de publicaciones encontradas en el periodo.
     * @throws {Error} Si ocurre un error al obtener las publicaciones.
     */
    async obtenerPublicacionesPorPeriodo(fechaInicio, fechaFin, offset) {
        try {
            const publicacionesObtenidas = await Publicacion.findAll({
                where: {
                    fechaPublicacion: {
                        [Op.between]: [fechaInicio, fechaFin] //Se usa el operador between para las fechas que están dentro del periodo
                    }
                },
                include: [{
                    model: Subasta,
                    as: "Subastum"
                },
                {
                    model: Categoria,
                    as: "Categorium"
                },
                {
                    model: Usuario,
                    as: "Usuario"
                },
                {
                    model: ImagenesPublicacion,
                    as: "ImagenesPublicacions"
                },
                {
                    model: EtiquetasPublicacion,
                    as: "EtiquetasPublicacions"
                }
                ],
                limit: 20,
                offset
            });
            return publicacionesObtenidas;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualiza los datos de una publicación existente.
     * 
     * @param {number} idPublicacion - ID de la publicación a actualizar.
     * @param {string} titulo - Nuevo título de la publicación.
     * @param {string} descripcion - Nueva descripción de la publicación.
     * @param {number} precio - Nuevo precio de la publicación.
     * @param {string} estado - Nuevo estado de la publicación.
     * @param {number} idCategoria - Nueva categoría de la publicación.
     * @param {string[]} etiquetas - Nuevas etiquetas asociadas.
     * @param {string[]} imagenes - Nuevas URLs de imágenes asociadas.
     * @returns {Promise<Publicacion>} La publicación actualizada.
     * @throws {Error} Si ocurre un error al actualizar la publicación.
     */
    async actualizarPublicacion(idPublicacion, datosActualizados) {
        try {
            // 1. Buscar la publicación para actualizarla
            const publicacionObtenida = await Publicacion.findByPk(idPublicacion);

            // Si la publicación no existe, tira una excepción
            if (!publicacionObtenida) {
                throw new Error(`La publicación con ID ${idPublicacion} no existe.`);
            }

            // 2. Verificar si existe una subasta asociada
            const subastaExistente = await Subasta.findByPk(idPublicacion);
            console.log(" SUBASTA??????" + JSON.stringify(subastaExistente, null, 2));
            // 3. Si había una subasta pero ahora el tipo es 'venta', eliminarla
            if (subastaExistente) {
                console.log(`Eliminando subasta ID ${idPublicacion} - conversión a venta normal`);
                await subastaExistente.destroy();
            }

            // 6. Actualizar etiquetas
            const etiquetas = datosActualizados.etiquetas || [];
            await etiquetasDAO.actualizarEtiquetas(idPublicacion, etiquetas);

            // 7. Actualizar imagenes
            const imagenes = datosActualizados.imagenes || [];

            await imagenesDAO.actualizarImagenes(idPublicacion, imagenes);

            // 8. Actualizar la publicación
            const publicacionActualizada = await publicacionObtenida.update(datosActualizados);

            return publicacionActualizada;
        } catch (error) {
            console.error("Error al actualizar publicación:", error);
            throw error;
        }
    }

    /**
     * Elimina una publicación existente por su ID.
     * 
     * @param {number} idPublicacion - ID de la publicación a eliminar.
     * @returns {Promise<string>} Mensaje de éxito si la publicación fue eliminada.
     * @throws {Error} Si ocurre un error al eliminar la publicación o no existe.
     */
    async eliminarPublicacion(idPublicacion) {
        try {
            const publicacionObtenida = await Publicacion.findByPk(idPublicacion);

            if (!publicacionObtenida) {
                throw new Error('La publicacion no existe.');
            }

            await EtiquetasPublicacion.destroy({
                where: {
                    idPublicacion: idPublicacion
                }
            });

            await ImagenesPublicacion.destroy({
                where: {
                    idPublicacion: idPublicacion
                }
            });

            await Subasta.destroy({
                where: {
                    id: idPublicacion
                }
            });

            await publicacionObtenida.destroy();
            return 'Publicacion eliminada con exito.';
        } catch (error) {
            console.error("Error en DAO eliminarPublicacion:", error); 
            throw error;
        }
    }

    async actualizarEstado(idPublicacion, nuevoEstado) {
        try {
            const publicacion = await Publicacion.findByPk(idPublicacion);
            
            if (!publicacion) {
                throw new Error('La publicación no existe.');
            }

            publicacion.estado = nuevoEstado;
            
            await publicacion.save();
            return publicacion;

        } catch (error) {
            throw error;
        }
    }

}

//Se exporta la clase PublicacionesDAO
module.exports = new PublicacionesDAO();