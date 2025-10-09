const { Puja } = require('../models');

class PujaDAO {
    constructor() { }

    async crearPuja(monto, fechaPuja, idUsuario, idSubasta) {
        try {
            const puja = await Puja.create({
                monto,
                fechaPuja,
                idUsuario,
                idSubasta
            });
            return puja;
        } catch (error) {
            throw error;
        }
    }

    async obtenerPujas() {
        try {
            const pujas = await Pujas.findAll();
            return pujas;
        } catch (error) {
            throw error;
        }
    }

    async obtenerPujaPorId(idPuja) {
        try {
            const puja = await Puja.findByPk(idPuja);
            return puja;
        } catch (error) {
            throw error;
        }
    }

    async actualizarPuja(idPuja, monto, fechaPuja, idUsuario, idSubasta) {
        try {
            await Puja.update(
                { monto, fechaPuja, idUsuario, idSubasta },
                { where: { idPuja } }
            );
            const pujaActualizada = await Puja.findByPk(id);
            return pujaActualizada;
        } catch (error) {
            throw error;
        }
    }

    async eliminarPuja(idPuja) {
        try {
            const puja = await Puja.findByPk(idPuja);
            if (!puja) {
                throw new Error(`Puja con id: ${idPuja} no encontrada`);
            }
            await puja.destroy();
            return 'Puja eliminada con éxito.';
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PujaDAO();