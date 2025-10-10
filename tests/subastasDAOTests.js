const { sequelize } = require('../models');
const usuariosDAO = require('../dataAccess/usuariosDAO');
const subastasDAO = require('../dataAccess/subastasDAO');
const categoriasDAO = require('../dataAccess/categoriasDAO');

async function subastasDAOTests() {
  try {
    // Sincronizar los modelos con la base de datos.
    await sequelize.sync();

    // Primero creamos un usuario.
    const datosUsuario = {
      nombres: "Diego",
      apellidoPaterno: "Valenzuela",
      apellidoMaterno: "Parra",
      fechaNacimiento: "2004-06-03",
      ciudad: "Ciudad Obregón",
      correo: "diegovalenzuela@gmail.com",
      contrasenia: "diego123",
      telefono: "6448975623",
      fotoPerfil: "url/diego.jpg"
    };
    const usuario = await usuariosDAO.crearUsuario(datosUsuario);

    const categoria1 = await categoriasDAO.crearCategoria('Electrónica');
    const categoria2 = await categoriasDAO.crearCategoria('Ropa');

    // Ahora creamos las subastas.
    console.log('\n--- Probando crearSubasta ---');
    const datosSubasta1 = {
      titulo: 'Iphone 17',
      descripcion: 'Reacondicionado con poco uso.',
      fechaPublicacion: new Date(),
      precio: 30000.00,
      estado: 'disponible',
      etiquetas: ['apple', 'celular'],
      imagenes: ['url/imagen1.jpg', 'url/imagen2.jpg'],
      idCategoria: usuario.id,
      idUsuario: categoria1.id,
      fechaInicio: new Date(),
      fechaFin: new Date()
    };
    const subastaCreada1 = await subastasDAO.crearSubasta(datosSubasta1);
    console.log('Subasta creada:', subastaCreada1.toJSON());

    const datosSubasta2 = {
      titulo: 'Chanclas Balenciaga',
      descripcion: 'Están manchadas de popó de perro y tienen la suela lisa.',
      fechaPublicacion: new Date(),
      precio: 1000.00,
      estado: 'disponible',
      etiquetas: ['balenciaga', 'calzado'],
      imagenes: ['url/imagen1.jpg', 'url/imagen2.jpg'],
      idCategoria: usuario.id,
      idUsuario: categoria2.id,
      fechaInicio: new Date(),
      fechaFin: new Date()
    };
    const subastaCreada2 = await subastasDAO.crearSubasta(datosSubasta2);
    console.log('Subasta creada:', subastaCreada2.toJSON());

    // 2. Prueba de obtenerSubastas
    console.log('\n--- Probando obtenerSubastas ---');
    const subastas = await subastasDAO.obtenerSubastas();
    console.log('Todas las subastas:\n', JSON.stringify(subastas, null, 2));

    // 3. Prueba de obtenerSubastasPorUsuario
    console.log('\n--- Probando obtenerSubastasPorUsuario ---');
    const subastasPorUsuario = await publicacionesDAO.obtenerSubastasPorUsuario(usuario.id);
    console.log(`El usuario ${usuario.id} tiene ${subastasPorUsuario.length} subastas.`);

    // 4. Prueba de obtenerSubastasPorTitulo
    console.log('\n--- Probando obtenerSubastasPorTitulo ---');
    const subastasPorTitulo = await publicacionesDAO.obtenerSubastasPorTitulo('iphone');
    console.log(`Se encontraron ${subastasPorTitulo.length} subastas con "iphone" en el título.`);

    // 5. Prueba de obtenerPublicacionesPorCategoria
    console.log('\n--- Probando obtenerPublicacionesPorCategoria ---');
    const pubsPorCategoria = await publicacionesDAO.obtenerPublicacionesPorCategoria(idPublicacion);
    console.log(`Se encontraron ${pubsPorCategoria.length} publicaciones en la categoría ${idPublicacion}.`);


    // 6. Prueba de obtenerPublicacionesPorEtiquetas
    console.log('\n--- Probando obtenerPublicacionesPorEtiquetas (["laptop"]) ---');
    const pubsPorEtiqueta = await publicacionesDAO.obtenerPublicacionesPorEtiquetas(['laptop']);
    console.log(`Se encontraron ${pubsPorEtiqueta.length} publicaciones con la etiqueta "laptop".`);

    // 7. Prueba de actualizarPublicacion
    console.log('\n--- Probando actualizarPublicacion ---');
    const publicacionActualizada = await publicacionesDAO.actualizarPublicacion(
      idPublicacion,
      'Laptop Gamer Seminueva',
      'Laptop con RTX 4090, 32GB RAM. Solo 3 meses de uso.',
      42000,
      'vendido',
      1,
      [],
      []
    );
    console.log('Publicación Actualizada:', publicacionActualizada.toJSON());

    // 8. Prueba de eliminarPublicacion
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

subastasDAOTests();