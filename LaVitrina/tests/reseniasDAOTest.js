const { sequelize } = require('../models');
const usuariosDAO = require('../dataAccess/usuariosDAO');
const reseniasDAO = require('../dataAccess/reseniasDAO');

async function reseniasDAOTest() {
  try {
    // Sincronizar los modelos con la base de datos
    await sequelize.sync();

    // Primero creamos usuarios.
    const datosUsuarioReseniado = {
      nombres: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "Gómez",
      fechaNacimiento: "2004-06-03",
      ciudad: "Ciudad Obregón",
      correo: "juanperez@gmail.com",
      contrasenia: "juan123",
      telefono: "0123456789",
      fotoPerfil: "url/juan.jpg"
    };
    const usuarioReseniado = await usuariosDAO.crearUsuario(datosUsuarioReseniado);
    console.log('Usuario reseñado creado:', usuarioReseniado.toJSON());

    const datosUsuarioCreador = {
      nombres: "José",
      apellidoPaterno: "García",
      apellidoMaterno: "González",
      fechaNacimiento: "2004-12-20",
      ciudad: "WhatsAppve",
      correo: "josegarcia@gmail.com",
      contrasenia: "jose123",
      telefono: "9876543210",
      fotoPerfil: "url/jose.jpg"
    };
    const usuarioCreador = await usuariosDAO.crearUsuario(datosUsuarioCreador);
    console.log('Usuario creador creado:', usuarioCreador.toJSON());

    // Ahora creamos las reseñas.
    console.log('\n--- Probando crearResenia ---');
    const datosResenia = {
      titulo: "ES UN ESTAFADOR!!!!",
      descripcion: "El vendedor Juan Pérez me estafó. Me hizo pagarle por transferencia y nunca me dio mi labubu de oro de 24 kilates. 😠😡",
      calificacion: 1,
      fechaResenia: new Date(),
      idUsuarioReseniado: usuarioReseniado.id,
      idUsuarioCreador: usuarioCreador.id
    };
    const reseniaCreada = await reseniasDAO.crearResenia(datosResenia);
    console.log('Resenia creada:', reseniaCreada.toJSON());

    const datosResenia2 = {
      titulo: "Muy buen vendedor!!!!",
      descripcion: "Sí vende lo que dice y en perfectas condiciones.",
      calificacion: 5,
      fechaResenia: new Date(),
      idUsuarioReseniado: usuarioCreador.id,
      idUsuarioCreador: usuarioReseniado.id
    };
    const reseniaCreada2 = await reseniasDAO.crearResenia(datosResenia2);

    const datosResenia3 = {
      titulo: "Vaya tío más majo!",
      descripcion: "Me ha vendido un tralalero tralalá factory new marble fade.",
      calificacion: 4,
      fechaResenia: new Date(),
      idUsuarioReseniado: usuarioReseniado.id,
      idUsuarioCreador: usuarioCreador.id
    };
    const reseniaCreada3 = await reseniasDAO.crearResenia(datosResenia3);

    // Obtener reseñas.
    console.log('\n--- Probando obtenerResenias ---');
    const resenias = await reseniasDAO.obtenerResenias();
    console.log('Todas las reseñas:\n', JSON.stringify(resenias, null, 2));

    // Obtener reseña por ID.
    console.log('\n--- Probando obtenerReseniaPorId ---');
    const reseniaEncontrada = await reseniasDAO.obtenerReseniaPorId(reseniaCreada.id);
    console.log('Resenia encontrada:', reseniaEncontrada.toJSON());

    // Obtener reseñas por ID del usuario reseñado.
    console.log('\n--- Probando obtenerReseniaPorUsuarioReseniado ---');
    const reseniasEncontradas1 = await reseniasDAO.obtenerReseniasPorUsuarioReseniado(usuarioReseniado.id);
    console.log('Reseñas SOBRE ' + usuarioReseniado.nombres + ' encontradas:\n', JSON.stringify(reseniasEncontradas1, null, 2));

    // Obtener reseñas más altas de un usuario.
    console.log('\n--- Probando obtenerReseniasMasAltas ---');
    const reseniasEncontradas2 = await reseniasDAO.obtenerReseniasMasAltas(usuarioReseniado.id);
    console.log('Reseñas más altas SOBRE ' + usuarioReseniado.nombres + ' encontradas:\n', JSON.stringify(reseniasEncontradas2, null, 2));

    // Obtener reseñas más bajas de un usuario.
    console.log('\n--- Probando obtenerReseniasMasBajas ---');
    const reseniasEncontradas3 = await reseniasDAO.obtenerReseniasMasBajas(usuarioReseniado.id);
    console.log('Reseñas más bajas SOBRE ' + usuarioReseniado.nombres + ' encontradas:\n', JSON.stringify(reseniasEncontradas3, null, 2));

    // Obtener reseña por ID del usuario creador de reseñas.
    console.log('\n--- Probando obtenerReseniaPorUsuarioCreador ---');
    const reseniasEncontradas4 = await reseniasDAO.obtenerReseniasPorUsuarioCreador(usuarioCreador.id);
    console.log('Reseñas HECHAS POR ' + usuarioCreador.nombres + ' encontradas:\n', JSON.stringify(reseniasEncontradas4, null, 2));

    // Actualizar reseña.
    console.log('\n--- Probando actualizarResenia ---');
    const datosReseniaActualizada = {
      titulo: "Eh mentira, es un muy buen vendedor!!!!",
      descripcion: "Me confundí de persona, Juan sí vende lo que promociona.",
      calificacion: 5,
      fechaResenia: new Date(),
      idUsuarioReseniado: usuarioReseniado.id,
      idUsuarioCreador: usuarioCreador.id
    };
    const reseniaActualizada = await reseniasDAO.actualizarResenia(reseniaCreada.id, datosReseniaActualizada);
    console.log('Resenia actualizada:', reseniaActualizada.toJSON());

    // Eliminar reseña.
    console.log('\n--- Probando eliminarResenia ---');
    const resultadoEliminar = await reseniasDAO.eliminarResenia(reseniaCreada2.id);
    console.log('Resultado de la eliminación:', resultadoEliminar);
    const reseniaEliminada = await reseniasDAO.obtenerReseniaPorId(reseniaCreada2.id);
    console.log('¿Reseña eliminado existe?:', reseniaEliminada ? 'No' : 'Sí, fue eliminado');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
}

reseniasDAOTest();