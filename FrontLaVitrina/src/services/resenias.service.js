import { Resenia } from "../models/resenia.js";

export class ReseniasService {

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

}