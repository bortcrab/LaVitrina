const { execSync } = require('child_process');

const { sequelize, Usuario, Subasta, Publicacion } = require('../models');
const pujasDAO = require('../dataAccess/pujasDAO');
const usuariosDAO = require('../dataAccess/usuariosDAO');
const categoriasDAO = require('../dataAccess/categoriasDAO');
const subastasDAO = require('../dataAccess/subastasDAO');

async function pujasDAOTest() {
    try {
        // Sincronizar los modelos con la base de datos
        await sequelize.sync();

        // Datos de ejemplo para un usuario creador de subastas
        const datosUsuario = {
            nombres: "Carlos",
            apellidoPaterno: "Ramírez",
            apellidoMaterno: "López",
            fechaNacimiento: "2000-01-15",
            ciudad: "Hermosillo",
            correo: "carlosramirez@gmail.com",
            contrasenia: "carlos123",
            telefono: "6621234567",
            fotoPerfil: "url/carlos.jpg"
        };
        // Creamos el usuario usando el DAO
        const usuario = await usuariosDAO.crearUsuario(datosUsuario);

        // Creamos una categoría base
        const categoria = await categoriasDAO.crearCategoria('Coleccionables');

        const datosSubasta = {
            titulo: "Figura edición limitada de Star Wars",
            descripcion: "Figura original de Luke Skywalker con sable de luz azul.",
            fechaPublicacion: new Date(),
            precio: 1500.00,
            estado: "Activa",
            etiquetas: ["figura", "coleccionable", "star wars"],
            imagenes: ["url/figura1.jpg", "url/figura2.jpg"],
            idCategoria: categoria.id,
            idUsuario: usuario.id,
            fechaInicio: new Date(),
            fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 días
        };
        // Creamos la subasta con su publicación interna
        const subasta = await subastasDAO.crearSubasta(datosSubasta);



        // --- 1. Crear pujas ---
        console.log('\n--- Probando crearPuja ---');
        const puja1 = await pujasDAO.crearPuja({
            idUsuario: usuario.id,
            idSubasta: subasta.id,
            monto: 21000,
            fechaPuja: new Date()
        });
        console.log('Puja creada:', puja1.toJSON());

        const puja2 = await pujasDAO.crearPuja({
            idUsuario: usuario.id,
            idSubasta: subasta.id,
            monto: 22000,
            fechaPuja: new Date()
        });
        console.log('Segunda puja creada:', puja2.toJSON());

        // --- 2. Obtener todas las pujas ---
        console.log('\n--- Probando obtenerPujas ---');
        const todasPujas = await pujasDAO.obtenerPujas();
        console.log(`Total de pujas: ${todasPujas.length}`);

        // --- 3. Obtener pujas por usuario ---
        console.log('\n--- Probando obtenerPujasPorUsuario ---');
        const pujasUsuario = await pujasDAO.obtenerPujasPorUsuario(usuario.id);
        console.log(`Usuario ${usuario.id} tiene ${pujasUsuario.length} pujas.`);

        // --- 4. Obtener puja por ID ---
        console.log('\n--- Probando obtenerPujaPorId ---');
        const pujaObtenida = await pujasDAO.obtenerPujaPorId(puja1.id);
        console.log('Puja obtenida por ID:', pujaObtenida.toJSON());

        // --- 5. Obtener puja más alta de la subasta ---
        console.log('\n--- Probando obtenerPujaMasAlta ---');
        const pujaAlta = await pujasDAO.obtenerPujaMasAlta(subasta.id);
        console.log('Puja más alta:', pujaAlta.toJSON());

        // --- 6. Actualizar puja ---
        console.log('\n--- Probando actualizarPuja ---');
        const pujaActualizada = await pujasDAO.actualizarPuja(puja1.id, { monto: 23000 });
        console.log('Puja actualizada:', pujaActualizada.toJSON());

        // --- 7. Eliminar puja ---
        console.log('\n--- Probando eliminarPuja ---');
        const resultadoEliminar = await pujasDAO.eliminarPuja(puja2.id);
        console.log('Resultado de eliminar puja:', resultadoEliminar);

    } catch (error) {
        console.error('Error durante las pruebas de pujas:', error);
    } finally {
        console.log('Limpiando y reconstruyendo base de datos...');
        execSync('npx sequelize db:drop', { stdio: 'inherit' });
        execSync('npx sequelize db:create', { stdio: 'inherit' });
        execSync('npx sequelize db:migrate', { stdio: 'inherit' });
        console.log('Base de datos restaurada correctamente.');
        await sequelize.close();
        console.log('Conexión cerrada.');
    }
}

pujasDAOTest();
