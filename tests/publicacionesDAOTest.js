const { sequelize, Usuario, Categoria } = require('../models');
const publicacionesDAO = require('../dataAccess/publicacionesDAO');

async function realizarTransacciones() {
    try {
        // Sincronizar los modelos con la base de datos
        await sequelize.sync();

        // --- Crear usuario base si no existe ---
        let usuario = await Usuario.findOne({ where: { correo: 'usuario@demo.com' } });
        if (!usuario) {
            usuario = await Usuario.create({
                nombres: 'Demo',
                apellidoPaterno: 'Usuario',
                apellidoMaterno: 'Prueba',
                fechaNacimiento: '2000-01-01',
                ciudad: 'Ciudad Demo',
                correo: 'usuario@demo.com',
                contrasenia: 'demo123',
                telefono: '5555555555',
                fotoPerfil: 'url/demo.jpg'
            });
            console.log('Usuario creado:', usuario.toJSON());
        }

        // --- Crear categoría base si no existe ---
        let categoria = await Categoria.findOne({ where: { nombre: 'Electrónica' } });
        if (!categoria) {
            categoria = await Categoria.create({ nombre: 'Electrónica' });
            console.log('Categoría creada:', categoria.toJSON());
        }

        // --- 1. Prueba de crearPublicacion ---
        console.log('\n--- Probando crearPublicacion ---');
        const nuevaPublicacion = await publicacionesDAO.crearPublicacion(
            'Laptop Gamer Nueva',
            'Laptop con RTX 4090, 32GB RAM.',
            new Date(),
            45000,
            'disponible',
            ['gamer', 'laptop', 'nvidia'],   // etiquetas
            ['url/imagen1.jpg', 'url/imagen2.jpg'], // imágenes
            categoria.id, // ID de categoría creada
            usuario.id    // ID de usuario creado
        );
        console.log('Publicación Creada:', nuevaPublicacion.toJSON());
        const idPublicacion = nuevaPublicacion.id;

        // --- 2. Prueba de obtenerPublicaciones ---
        console.log('\n--- Probando obtenerPublicaciones ---');
        const todasLasPublicaciones = await publicacionesDAO.obtenerPublicaciones();
        console.log(`Se encontraron ${todasLasPublicaciones.length} publicaciones.`);

        // --- 3. Prueba de obtenerPublicacionPorUsuario ---
        console.log('\n--- Probando obtenerPublicacionPorUsuario ---');
        const pubsPorUsuario = await publicacionesDAO.obtenerPublicacionPorUsuario(usuario.id);
        console.log(`El usuario ${usuario.id} tiene ${pubsPorUsuario.length} publicaciones.`);

        // --- 4. Prueba de obtenerPublicacionesPorTitulo ---
        console.log('\n--- Probando obtenerPublicacionesPorTitulo ("Gamer") ---');
        const pubsPorTitulo = await publicacionesDAO.obtenerPublicacionesPorTitulo('Gamer');
        console.log(`Se encontraron ${pubsPorTitulo.length} publicaciones con "Gamer" en el título.`);

        // --- 5. Prueba de obtenerPublicacionesPorCategoria ---
        console.log('\n--- Probando obtenerPublicacionesPorCategoria ---');
        const pubsPorCategoria = await publicacionesDAO.obtenerPublicacionesPorCategoria(categoria.id);
        console.log(`Se encontraron ${pubsPorCategoria.length} publicaciones en la categoría ${categoria.nombre}.`);

        // --- 6. Prueba de obtenerPublicacionesPorEtiquetas ---
        console.log('\n--- Probando obtenerPublicacionesPorEtiquetas (["laptop"]) ---');
        const pubsPorEtiqueta = await publicacionesDAO.obtenerPublicacionesPorEtiquetas(['laptop']);
        console.log(`Se encontraron ${pubsPorEtiqueta.length} publicaciones con la etiqueta "laptop".`);

        // --- 7. Prueba de actualizarPublicacion ---
        console.log('\n--- Probando actualizarPublicacion ---');
        const publicacionActualizada = await publicacionesDAO.actualizarPublicacion(
            idPublicacion,
            'Laptop Gamer Seminueva',
            'Laptop con RTX 4090, 32GB RAM. Solo 3 meses de uso.',
            42000,
            'vendido',
            categoria.id,
            [], // etiquetas
            []  // imágenes
        );
        console.log('Publicación Actualizada:', publicacionActualizada.toJSON());

        // --- 8. Prueba de eliminarPublicacion ---
        console.log('\n--- Probando eliminarPublicacion ---');
        const resultadoEliminar = await publicacionesDAO.eliminarPublicacion(idPublicacion);
        console.log('Resultado de la eliminación:', resultadoEliminar);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
        console.log('Conexión cerrada.');
    }
}

realizarTransacciones();
