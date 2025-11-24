import { Usuario } from '../models/usuario.js';
// Datos simulados del vendedor
const VENDEDOR_SIMULADO = {
    id: 1,
    nombre: "Pedrito Sola",
    puntaje: 4.9,
    totalResenias: 108,
    imagenUrl: "FrontLaVitrina/src/assets/pedrito.png"
};
export class UsuariosService {

    /**
     * Simula la obtención de los datos de un vendedor por su ID.
     * @param {number} vendedorId - El ID del vendedor.
     * @returns {Promise<object>} Los datos del vendedor.
     */
    static async getVendedor(vendedorId) {
        // En una aplicación real, harías una llamada a la API con el ID
        console.log(`Simulando obtención de datos del vendedor ID: ${vendedorId}`);
        await new Promise(resolve => setTimeout(resolve, 50)); // Simular latencia de red

        // Simplemente retornamos el objeto simulado para cualquier ID
        return VENDEDOR_SIMULADO;
    }
}