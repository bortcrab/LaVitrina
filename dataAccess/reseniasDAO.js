const { Resenia } = require('../models');

class ReseniasDAO {
    constructor() { }

    async crearResenia(datosResenia) {
        try {
            const resenia = await Resenia.create({
                // Usamos todos los datos del objeto
                ...datosResenia
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

    async obtenerReseniaPorId(idResenia) {
        try {
            const resenia = await Resenia.findByPk(idResenia);
            return resenia;
        } catch (error) {
            throw error;
        }
    }

    async obtenerReseniasPorUsuarioReseniado(idUsuarioReseniado) {
        try {
            const resenia = await Resenia.findAll({ where: { idUsuarioReseniado: idUsuarioReseniado } });
            return resenia;
        } catch (error) {
            throw error;
        }
    }

    async obtenerReseniasMasAltas(idUsuarioReseniado) {
        try {
            const resenia = await Resenia.findAll({
                where: { idUsuarioReseniado: idUsuarioReseniado },
                order: [['calificacion', 'DESC']]
            });
            return resenia;
        } catch (error) {
            throw error;
        }
    }
    
    async obtenerReseniasMasBajas(idUsuarioReseniado) {
        try {
            const resenia = await Resenia.findAll({
                where: { idUsuarioReseniado: idUsuarioReseniado },
                order: [['calificacion', 'ASC']]
            });
            return resenia;
        } catch (error) {
            throw error;
        }
    }

    async obtenerReseniasPorUsuarioCreador(idUsuarioCreador) {
        try {
            const resenia = await Resenia.findAll({ where: { idUsuarioCreador: idUsuarioCreador } });
            return resenia;
        } catch (error) {
            throw error;
        }
    }

    async actualizarResenia(idResenia, datosResenia) {
        try {
            await Resenia.update(datosResenia, { where: { id: idResenia } });
            const reseniaActualizada = await Resenia.findByPk(idResenia);
            return reseniaActualizada;
        } catch (error) {
            throw error;
        }
    }

    async eliminarResenia(idResenia) {
        try {
            const resenia = await Resenia.findByPk(idResenia);
            if (!resenia) {
                throw new Error(`Resenia con id: ${idResenia} no encontrada`);
            }
            await resenia.destroy();
            return 'Resenia eliminada con éxito.';
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ReseniasDAO();