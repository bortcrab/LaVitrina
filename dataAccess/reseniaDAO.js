const { Resenia } = require('../models');

class ReseniaDAO {
    constructor() { }

    async crearResenia(titulo, descripcion, calificacion, fechaResenia, idUsuarioReseniado, idUsuarioCreador) {
        try {
            const resenia = await Resenia.create({
                titulo,
                descripcion,
                calificacion,
                fechaResenia,
                idUsuarioReseniado,
                idUsuarioCreador
            });
            return resenia;
        } catch (error) {
            throw error;
        }
    }

    async obtenerResenias() {
        try {
            const resenias = await Resenia.findAll();
            return resenias;
        } catch (error) {
            throw error;
        }
    }

    async obtenerReseniaPorId(id) {
        try {
            const resenia = await Resenia.findByPk(id);
            return resenia;
        } catch (error) {
            throw error;
        }
    }

    async actualizarResenia(idResenia, titulo, descripcion, calificacion, fechaResenia, idUsuarioReseniado, idUsuarioCreador) {
        try {
            await Resenia.update(
                { titulo, descripcion, calificacion, fechaResenia, idUsuarioReseniado, idUsuarioCreador },
                { where: { idResenia } }
            );
            const reseniaActualizada = await Resenia.findByPk(id);
            return reseniaActualizada;
        } catch (error) {
            throw error;
        }
    }

    async eliminarResenia(id) {
        try {
            const resenia = await Resenia.findByPk(id);
            if (!resenia) {
                throw new Error(`Resenia con id: ${id} no encontrada`);
            }
            await resenia.destroy();
            return 'Resenia eliminada con éxito.';
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ReseniaDAO();