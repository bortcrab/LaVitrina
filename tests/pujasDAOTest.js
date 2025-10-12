const { execSync } = require('child_process');

// Importamos la conexión y los DAOs necesarios
const { sequelize } = require('../models');
const pujasDAO = require('../dataAccess/pujasDAO');
const usuariosDAO = require('../dataAccess/usuariosDAO');
const categoriasDAO = require('../dataAccess/categoriasDAO');
const subastasDAO = require('../dataAccess/subastasDAO');

// Función principal que ejecuta todas las pruebas de las pujas
async function pujasDAOTest() {
    try {
        // Sincroniza los modelos con la base de datos
        // (solo crea las tablas si no existen)
        //await sequelize.sync();

        // =====================================================
        // 1. CREACIÓN DE DATOS BASE: USUARIO, CATEGORÍA Y SUBASTA
        // =====================================================
        console.log('\n--- Creando usuario, categoría y subasta base ---');

        // Datos de ejemplo para un usuario que hará pujas
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
        console.log('Usuario creado:', usuario.toJSON());

        // Creamos una categoría base
        const categoria = await categoriasDAO.crearCategoria('Coleccionables');
        console.log('Categoría creada:', categoria.toJSON());

        // Creamos una subasta base para asociar las pujas
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

        const subasta = await subastasDAO.crearSubasta(datosSubasta);
        console.log('Subasta creada:\n', JSON.stringify(subasta, null, 2));

        // =====================================================
        // 2. CREAR PUJAS
        // =====================================================
        console.log('\n--- Probando crearPuja ---');

        // Creamos la primera puja
        const puja1 = await pujasDAO.crearPuja({
            idUsuario: usuario.id,
            idSubasta: subasta.id,
            monto: 21000,
            fechaPuja: new Date()
        });
        console.log('Puja creada:', puja1.toJSON());

        // Creamos una segunda puja del mismo usuario
        const puja2 = await pujasDAO.crearPuja({
            idUsuario: usuario.id,
            idSubasta: subasta.id,
            monto: 22000,
            fechaPuja: new Date()
        });
        console.log('Segunda puja creada:', puja2.toJSON());

        // =====================================================
        // 3. OBTENER TODAS LAS PUJAS
        // =====================================================
        console.log('\n--- Probando obtenerPujas ---');
        const todasPujas = await pujasDAO.obtenerPujas();
        console.log('Total de pujas registradas:', todasPujas.length);

        // =====================================================
        // 4. OBTENER PUJAS POR USUARIO
        // =====================================================
        console.log('\n--- Probando obtenerPujasPorUsuario ---');
        const pujasUsuario = await pujasDAO.obtenerPujasPorUsuario(usuario.id);
        console.log(`Usuario ${usuario.nombres} tiene ${pujasUsuario.length} pujas.`);

        // =====================================================
        // 5. OBTENER PUJA POR ID
        // =====================================================
        console.log('\n--- Probando obtenerPujaPorId ---');
        const pujaObtenida = await pujasDAO.obtenerPujaPorId(puja1.id);
        console.log('Puja obtenida por ID:', pujaObtenida.toJSON());

        // =====================================================
        // 6. OBTENER PUJA MÁS ALTA DE UNA SUBASTA
        // =====================================================
        console.log('\n--- Probando obtenerPujaMasAlta ---');
        const pujaAlta = await pujasDAO.obtenerPujaMasAlta(subasta.id);
        console.log('Puja más alta encontrada:', pujaAlta.toJSON());

        // =====================================================
        // 7. ACTUALIZAR UNA PUJA
        // =====================================================
        console.log('\n--- Probando actualizarPuja ---');
        const pujaActualizada = await pujasDAO.actualizarPuja(puja1.id, { monto: 23000 });
        console.log('Puja actualizada:', pujaActualizada.toJSON());

        // =====================================================
        // 8. ELIMINAR UNA PUJA
        // =====================================================
        console.log('\n--- Probando eliminarPuja ---');
        const resultadoEliminar = await pujasDAO.eliminarPuja(puja2.id);
        console.log('Resultado de eliminación de la segunda puja:', resultadoEliminar);

    } catch (error) {
        // Si algo falla, mostramos el error
        console.error('Error durante las pruebas de pujas:', error);
    } finally {
        // Cerramos la conexión a la base de datos
        await sequelize.close();
        console.log('Conexión cerrada.');

        // =====================================================
        // LIMPIEZA Y RECONSTRUCCIÓN DE LA BASE DE DATOS
        // =====================================================
        console.log('Limpiando y reconstruyendo base de datos...');
        execSync('npx sequelize db:drop', { stdio: 'inherit' });
        execSync('npx sequelize db:create', { stdio: 'inherit' });
        execSync('npx sequelize db:migrate', { stdio: 'inherit' });
        console.log('Base de datos restaurada correctamente.');

    }
}

// Ejecutamos la función principal
pujasDAOTest();
