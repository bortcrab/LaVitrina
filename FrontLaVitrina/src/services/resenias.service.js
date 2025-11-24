import { Resenia } from "../models/resenia.js";

export class ReseniasService {
    // Inicializamos las reseñas estáticamente para que persistan las agregadas
    static #resenias = [
        new Resenia(
            2,
            "Me encantó",
            "Mayonesa McCormick",
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
            "Pedrito nos vendió confianza, pero al recibir el pedido resultó ser de otra marca 😔. Muy amable, eso sí, pero nos quedamos con un sabor raro en la boca.",
            0,
            new Date(2025, 10, 20)
        )];
        
    static async getResenias() {
        const resenias = [
            new Resenia(
                2,
                "Me encantó",
                "Mayonesa McCormick",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
                "Pedrito nos vendió confianza, pero al recibir el pedido resultó ser de otra marca 😔. Muy amable, eso sí, pero nos quedamos con un sabor raro en la boca.",
                0,
                new Date(2025, 10, 20)
            ),
            new Resenia(
                1,
                "Muy mal sabor de boca",
                "Mayonesa Hellmann's",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
                "Recomiendo al 100% sus productos. Hasta me promociona gratis. Volvería a comprar sin duda.",
                1,
                new Date(2025, 10, 20)
            ),
            new Resenia(
                2,
                "Me encantó",
                "Mayonesa McCormick",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
                "Pedrito nos vendió confianza, pero al recibir el pedido resultó ser de otra marca 😔. Muy amable, eso sí, pero nos quedamos con un sabor raro en la boca.",
                5,
                new Date(2025, 10, 20)
            ),
            new Resenia(
                3,
                "Muy mal sabor de boca",
                "Mayonesa Hellmann's",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
                "Recomiendo al 100% sus productos. Hasta me promociona gratis. Volvería a comprar sin duda.",
                2,
                new Date(2025, 10, 20)
            ),
            new Resenia(
                4,
                "Muy mal sabor de boca",
                "Mayonesa Hellmann's",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
                "Recomiendo al 100% sus productos. Hasta me promociona gratis. Volvería a comprar sin duda.",
                3,
                new Date(2025, 10, 20)
            ),
            new Resenia(
                5,
                "Muy mal sabor de boca",
                "Mayonesa Hellmann's",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
                "Recomiendo al 100% sus productos. Hasta me promociona gratis. Volvería a comprar sin duda.",
                4,
                new Date(2025, 10, 20)
            )
        ];

        return resenias;
    }

    /**
     * Agrega una nueva reseña a la lista.
     * @param {number} calificacion - La calificación dada (1 a 5).
     * @param {string} titulo - El título de la reseña.
     * @param {string} descripcion - El texto de la reseña.
     * @returns {Promise<Resenia>} La nueva reseña agregada.
     */
    static async agregarResenia(calificacion, titulo, descripcion) {
        // En una app real, el vendedor/producto se obtendría del contexto
        // y el ID se generaría en el backend. Aquí simulamos con valores fijos/autoincrementales.

        // Simular generación de ID (simple)
        const newId = ReseniasService.#resenias.length > 0
            ? Math.max(...ReseniasService.#resenias.map(r => r.id)) + 1
            : 1;

        const nuevaResenia = new Resenia(
            newId,
            titulo,
            "Producto/Vendedor Simulado", // Producto/Vendedor simulado
            "FrontLaVitrina/src/assets/pedrito.png", // Imagen simulada
            descripcion,
            calificacion,
            new Date() // Fecha actual
        );

        ReseniasService.#resenias.push(nuevaResenia);

        console.log("Nueva reseña agregada en el servicio:", nuevaResenia);
        return nuevaResenia;
    }

}