const { EtiquetasPublicacion } = require('../models');
const { Op } = require('sequelize');

class EtiquetasDAO {
    constructor() { }

    async actualizarEtiquetas(idPublicacion, etiquetasActualizadas) {
        try {
            // 1. Obtener etiquetas actuales de la base de datos
            const etiquetasExistentes = await EtiquetasPublicacion.findAll({
                where: { idPublicacion }
            });

            // Convertir a array de strings para comparar fácilmente
            const etiquetasExistentesTexto = etiquetasExistentes.map(e => e.etiqueta);

            // 2. Encontrar etiquetas NUEVAS (están en actualizadas pero NO en BD)
            const etiquetasParaCrear = etiquetasActualizadas.filter(
                etiqueta => !etiquetasExistentesTexto.includes(etiqueta)
            );

            // 3. Encontrar etiquetas para BORRAR (están en BD pero NO en actualizadas)
            const etiquetasParaBorrar = etiquetasExistentesTexto.filter(
                etiqueta => !etiquetasActualizadas.includes(etiqueta)
            );

            // 4. Crear las nuevas etiquetas
            for (const etiqueta of etiquetasParaCrear) {
                await EtiquetasPublicacion.create({
                    etiqueta,
                    idPublicacion
                });
            }

            // 5. Borrar las etiquetas que ya no existen
            if (etiquetasParaBorrar.length > 0) {
                await EtiquetasPublicacion.destroy({
                    where: {
                        idPublicacion,
                        etiqueta: etiquetasParaBorrar
                    }
                });
            }

            console.log(`Etiquetas creadas: ${etiquetasParaCrear.length}`);
            console.log(`Etiquetas eliminadas: ${etiquetasParaBorrar.length}`);
            console.log(`Etiquetas sin cambios: ${etiquetasActualizadas.length - etiquetasParaCrear.length}`);

        } catch (error) {
            console.error('Error al actualizar etiquetas:', error);
            throw error;
        }
    }
}

module.exports = new EtiquetasDAO();