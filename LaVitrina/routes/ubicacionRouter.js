const express = require('express');
const router = express.Router();

// Nota: 'fetch' es nativo en Node.js v18+. 
// Si usas una versión anterior (v14 o v16), necesitas instalarlo: npm install node-fetch
// y descomentar la siguiente línea:
// const fetch = require('node-fetch'); 

router.get('/ciudades', async (req, res, next) => {
    const { busqueda } = req.query;

    // Validación básica
    if (!busqueda || busqueda.length < 3) {
        return res.json([]);
    }

    try {
        // 1. URL de la API externa (OpenStreetMap / Nominatim)
        // limit=5 para traer solo 5 resultados
        // addressdetails=0 para ahorrar datos
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(busqueda)}&format=json&featuretype=city&limit=5`;

        // 2. Hacemos la petición desde el BACKEND
        const response = await fetch(url, {
            headers: {
                // OpenStreetMap exige un User-Agent válido
                'User-Agent': 'LaVitrinaApp/1.0 (proyecto educativo)'
            }
        });

        if (!response.ok) {
            throw new Error(`Error externo: ${response.status}`);
        }

        const data = await response.json();

        // 3. Limpiamos los datos antes de enviarlos al frontend
        // Solo nos interesa el nombre completo para mostrarlo en la lista
        const ciudades = data.map(item => item.display_name);

        res.status(200).json(ciudades);

    } catch (error) {
        console.error('Error en proxy de ubicación:', error);
        // Pasamos el error al manejador global de errores
        next(error);
    }
});

module.exports = router;