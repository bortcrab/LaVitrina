const { ImagenesPublicacion } = require('../models');
const { Op } = require('sequelize');

class ImagenesDAO {
    constructor() { }

    async actualizarImagenes(idPublicacion, imagenesActualizadas) {
        try {
            // 1. Obtener imágenes actuales de la base de datos
            const imagenesExistentes = await ImagenesPublicacion.findAll({
                where: { idPublicacion }
            });

            // Extraer solo las URLs de las imágenes existentes para facilitar la comparación
            const urlsExistentes = imagenesExistentes.map(img => img.url);

            // 2. Encontrar URLs NUEVAS (están en actualizadas pero NO en BD)
            // Buscamos si la URL de la imagen actualizada NO está en la lista de URLs existentes
            const urlsParaCrear = imagenesActualizadas.filter(
                url => !urlsExistentes.includes(url)
            );

            // 3. Encontrar imágenes para BORRAR (están en BD pero NO en actualizadas)
            // Buscamos si la URL de la imagen existente NO está en la lista de imágenes actualizadas
            const imagenesParaBorrar = imagenesExistentes.filter(
                imagen => !imagenesActualizadas.includes(imagen.url)
            );

            // 4. Crear las nuevas imágenes
            for (const url of urlsParaCrear) {
                await ImagenesPublicacion.create({
                    url: url, // Usamos la URL que acabamos de filtrar
                    idPublicacion
                });
            }

            // 5. Borrar las imágenes que ya no existen
            for (const imagen of imagenesParaBorrar) {
                console.log("BORRANDO IMAGEN con URL: " + imagen.url);
                await ImagenesPublicacion.destroy({
                    where: {
                        idPublicacion,
                        url: imagen.url // Usamos la URL del objeto existente
                    }
                });
            }

            console.log(`Imágenes creadas: ${urlsParaCrear.length}`);
            console.log(`Imágenes eliminadas: ${imagenesParaBorrar.length}`);

            // La cantidad de imágenes que NO cambian son las URLsActualizadas menos las que se van a crear (las nuevas)
            console.log(`Imágenes sin cambios: ${imagenesActualizadas.length - urlsParaCrear.length}`);

        } catch (error) {
            console.error('Error al actualizar imágenes:', error);
            throw error;
        }
    }
}

module.exports = new ImagenesDAO();