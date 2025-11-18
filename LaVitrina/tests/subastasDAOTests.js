const { execSync } = require('child_process');

// Importamos la conexión y los DAOs necesarios
const { sequelize } = require('../models');
const usuariosDAO = require('../dataAccess/usuariosDAO');
const categoriasDAO = require('../dataAccess/categoriasDAO');
const subastasDAO = require('../dataAccess/subastasDAO');

// Función principal que ejecuta todas las pruebas de las subastas
async function subastasDAOTest() {
  try {
    // Sincroniza los modelos con la base de datos
    // (solo crea las tablas si no existen)
    //await sequelize.sync();

    // =====================================================
    // 1. CREACIÓN DE DATOS BASE: USUARIO Y CATEGORÍA
    // =====================================================
    console.log('\n--- Creando usuario y categoría base ---');

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
    console.log('Usuario creador creado:', usuario.toJSON());

    // Creamos una categoría base
    const categoria = await categoriasDAO.crearCategoria('Coleccionables');
    console.log('Categoría creada:', categoria.toJSON());

    // ========================================
    // 2. CREAR UNA SUBASTA COMPLETA
    // ========================================
    console.log('\n--- Probando crearSubasta ---');

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
    const subastaCreada = await subastasDAO.crearSubasta(datosSubasta);
    console.log('Subasta creada:\n', JSON.stringify(subastaCreada, null, 2));

    // ========================================
    // 3. OBTENER TODAS LAS SUBASTAS
    // ========================================
    console.log('\n--- Probando obtenerSubastas ---');
    const subastas = await subastasDAO.obtenerSubastas();
    console.log('Subastas encontradas:\n', JSON.stringify(subastas, null, 2));

    // ========================================
    // 4. OBTENER SUBASTAS POR USUARIO
    // ========================================
    console.log('\n--- Probando obtenerSubastasPorUsuario ---');
    const subastasPorUsuario = await subastasDAO.obtenerSubastasPorUsuario(usuario.id);
    console.log(`Subastas creadas por ${usuario.nombres}:\n`, JSON.stringify(subastasPorUsuario, null, 2));

    // ========================================
    // 5. BUSCAR SUBASTAS POR TÍTULO
    // ========================================
    console.log('\n--- Probando obtenerSubastasPorTitulo ---');
    const subastasPorTitulo = await subastasDAO.obtenerSubastasPorTitulo("Star Wars");
    console.log('Subastas encontradas con "Star Wars" en el título:\n', JSON.stringify(subastasPorTitulo, null, 2));

    // ========================================
    // 6. BUSCAR SUBASTAS POR CATEGORÍA
    // ========================================
    console.log('\n--- Probando obtenerSubastasPorCategoria ---');
    const subastasPorCategoria = await subastasDAO.obtenerSubastasPorCategoria(categoria.id);
    console.log(`Subastas en categoría "${categoria.nombre}":\n`, JSON.stringify(subastasPorCategoria, null, 2));

    // ========================================
    // 7. ACTUALIZAR UNA SUBASTA
    // ========================================
    console.log('\n--- Probando actualizarSubasta ---');

    const datosSubastaActualizada = {
      titulo: "Figura de colección de Luke Skywalker (actualizada)",
      descripcion: "Edición limitada 2025, con sable de luz LED real.",
      precio: 1800.00,
      estado: "Activa",
      idCategoria: categoria.id,
      etiquetas: ["figura", "coleccionable", "star wars", "edición especial"],
      imagenes: ["url/figura1_new.jpg", "url/figura2_new.jpg"]
    };

    // Actualizamos la subasta usando su ID
    const subastaActualizada = await subastasDAO.actualizarSubasta(subastaCreada.id, datosSubastaActualizada);
    console.log('Subasta actualizada:', subastaActualizada.toJSON());

    // ========================================
    // 8. ELIMINAR SUBASTA Y VERIFICAR
    // ========================================
    console.log('\n--- Probando eliminarSubasta ---');

    const resultadoEliminar = await subastasDAO.eliminarSubasta(subastaCreada.id);
    console.log('Resultado de eliminación:', resultadoEliminar);

    // Intentamos buscarla de nuevo para confirmar
    const subastaEliminada = await subastasDAO.obtenerSubastaPorId(subastaCreada.id);
    console.log('¿Subasta aún existe?:', subastaEliminada ? 'Sí, no se eliminó.' : 'No, fue eliminada correctamente.');

  } catch (error) {
    // Si algo falla, mostramos el error
    console.error('Error durante las pruebas:', error);
  } finally {
    console.log('Limpiando y reconstruyendo base de datos...');
    execSync('npx sequelize db:drop', { stdio: 'inherit' });
    execSync('npx sequelize db:create', { stdio: 'inherit' });
    execSync('npx sequelize db:migrate', { stdio: 'inherit' });
    console.log('Base de datos restaurada correctamente.');
    // Cerramos la conexión a la base de datos
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
}

// Ejecutamos la función principal
subastasDAOTest();
