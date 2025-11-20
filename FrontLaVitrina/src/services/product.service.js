import { Product } from '../models/product.js';

export class ProductService {
    static getProducts() {
        const productList = [
            new Product(
                1,
                "iPhone 11 en muy buen estado",
                "iPhone 11 color verde, 128GB, batería al 85%, con caja y accesorios originales",
                "$10,000",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
                "Venta",
                "María González"
            ),
            new Product(
                2,
                "MacBook Pro 2020",
                "MacBook Pro 13 pulgadas, 16GB RAM, 512GB SSD, perfectas condiciones",
                "$18,500",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
                "Venta",
                "Tech Store"
            ),
            new Product(
                3,
                "Departamento en renta zona centro",
                "2 recámaras, 1 baño, cocina integral, estacionamiento",
                "$8,000/mes",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=500&fit=crop",
                "Subasta",
                "Inmobiliaria del Valle"
            ),
            new Product(
                4,
                "Bicicleta de montaña",
                "Bicicleta Trek rodada 29, frenos de disco, suspensión delantera",
                "$7,500",
                "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&h=500&fit=crop",
                "Venta",
                "Juan Pérez"
            ),
            new Product(
                5,
                "PlayStation 5",
                "Consola nueva en caja sellada con 2 controles",
                "$12,000",
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
                "Subasta",
                "Gamers MX"
            ),
            new Product(
                6,
                "Cámara Canon EOS R6",
                "Cámara profesional con lente 24-105mm, menos de 5000 disparos",
                "$45,000",
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
                "Venta",
                "Photo Pro"
            ),
            new Product(
                7,
                "Sala de 3 piezas",
                "Sala moderna color gris, incluye sofá de 3 plazas y 2 sillones",
                "$15,000",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
                "Venta",
                "Muebles Confort"
            ),
            new Product(
                8,
                "Auto Honda Civic 2018",
                "Seminuevo, automático, único dueño, factura original",
                "$180,000",
                "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=500&h=500&fit=crop",
                "Venta",
                "Autos del Norte"
            ),
            new Product(
                9,
                "Mesa de trabajo para oficina",
                "Escritorio moderno con cajones, perfecto para home office",
                "$2,500",
                "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500&h=500&fit=crop",
                "Venta",
                "Office Solutions"
            )
        ];

        return productList;
    }
}