import { Usuario } from '../models/usuario.js';
const VENDEDORES_MOCK = [
    {
        id: "1",
        nombre: "Pedrito Sola",
        puntaje: 4.9,
        totalResenias: 108,
        imagenUrl: "FrontLaVitrina/src/assets/pedrito.png"
    },
    {
        id: "2",
        nombre: "María González",
        puntaje: 4.5,
        totalResenias: 45,
        imagenUrl: "https://picsum.photos/200?random=user2"
    }
];

export class UsuariosService {
    /**
     * Obtiene los datos de un vendedor por su ID.
     * @param {string} vendedorId - El ID del vendedor.
     * @returns {Promise<object>} Los datos del vendedor.
     */
    static async getVendedor(vendedorId) {
        console.log(`Obteniendo datos del vendedor ID: ${vendedorId}`);

        // Simular latencia de red
        await new Promise(resolve => setTimeout(resolve, 50));

        // Buscar el vendedor por ID
        const vendedor = VENDEDORES_MOCK.find(v => v.id === vendedorId);
        if (!vendedor) {
            throw new Error("Vendedor no encontrado");
        }

        // Retornar una copia para evitar modificaciones accidentales
        return JSON.parse(JSON.stringify(vendedor));
    }
}
