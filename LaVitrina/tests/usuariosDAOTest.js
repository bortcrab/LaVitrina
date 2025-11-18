const { sequelize } = require('../models'); // Asegúrate de que Categoria esté disponible
const { UsuarioDAO } = require('../dataAccess/usuariosDAO');
const usuariosDAO = require('../dataAccess/usuariosDAO');

async function realizarTransacciones() {
  try {
    // Sincronizar los modelos con la base de datos

    //ESTO BORRA TODOOOOOOO¡¡¡¡¡¡¡¡¡
    await sequelize.sync();
    // 1. Prueba de crearUsuario
    console.log('\n--- Probando crearUsuario ---');
    const datosNuevoUsuario = {
      nombres: "Ana",
      apellidoPaterno: "García",
      apellidoMaterno: "Salas",
      fechaNacimiento: "1998-05-15",
      ciudad: "Navojoa",
      correo: "ana.garcia@email.com",
      contrasenia: "ana123",
      telefono: "6441234567",
      fotoPerfil: "url/ana.jpg"
    };
    const usuarioCreado = await usuariosDAO.crearUsuario(datosNuevoUsuario);
    console.log('Usuario Creado:', usuarioCreado.toJSON());
    const idUsuario = usuarioCreado.id;

    // 2. Prueba de obtenerUsuarioPorId
    console.log('\n--- Probando obtenerUsuarioPorId ---');
    const usuarioPorId = await usuariosDAO.obtenerUsuarioPorId(idUsuario);
    console.log('Usuario por ID:', usuarioPorId.toJSON());

    // 3. Prueba de obtenerUsuarioPorCorreo
    console.log('\n--- Probando obtenerUsuarioPorCorreo ---');
    const usuarioPorCorreo = await usuariosDAO.obtenerUsuarioPorCorreo("ana.garcia@email.com");
    console.log('Usuario por Correo:', usuarioPorCorreo.toJSON());

    // 4. Prueba de iniciarSesion (con contraseña correcta)
    console.log('\n--- Probando iniciarSesion (éxito) ---');
    const loginExitoso = await usuariosDAO.iniciarSesion("ana.garcia@email.com", "ana123");
    console.log('Resultado Login Exitoso:', loginExitoso ? loginExitoso.toJSON() : 'Falló');

    // 5. Prueba de iniciarSesion (con contraseña incorrecta)
    console.log('\n--- Probando iniciarSesion (fallo) ---');
    const loginFallido = await usuariosDAO.iniciarSesion("ana.garcia@email.com", "contraseñaInvalida");
    console.log('Resultado Login Fallido:', loginFallido ? loginFallido.toJSON() : 'Falló correctamente');

    // 6. Prueba de cambiarContrasenia
    console.log('\n--- Probando cambiarContrasenia ---');
    const cambioExitoso = await usuariosDAO.cambiarContrasenia("ana.garcia@email.com", "ana123", "ana321");
    console.log('¿Contraseña cambiada?:', cambioExitoso);

    // 7. Prueba de iniciarSesion (con la nueva contraseña)
    console.log('\n--- Probando iniciarSesion (con nueva contraseña) ---');
    const nuevoLogin = await usuariosDAO.iniciarSesion("ana.garcia@email.com", "ana321");
    console.log('Resultado Nuevo Login:', nuevoLogin ? nuevoLogin.toJSON() : 'Falló');

    // 8. Prueba de actualizarUsuario
    console.log('\n--- Probando actualizarUsuario ---');
    const datosActualizados = {
      ciudad: "Hermosillo",
      telefono: "5555555555"
    };
    const usuarioActualizado = await usuariosDAO.actualizarUsuario(idUsuario, datosActualizados);
    console.log('Usuario Actualizado:', usuarioActualizado.toJSON());

    // 9. Prueba de obtenerUsuarios
    console.log('\n--- Probando obtenerUsuarios ---');
    // Creamos un segundo usuario para que la lista no esté vacía
    await usuariosDAO.crearUsuario({ ...datosNuevoUsuario, correo: 'pedro@email.com', telefono: '111' });
    const todosLosUsuarios = await usuariosDAO.obtenerUsuarios();
    console.log(`Encontrados ${todosLosUsuarios.length} usuarios.`);

    // 10. Prueba de eliminarUsuario
    console.log('\n--- Probando eliminarUsuario ---');
    const resultadoEliminar = await usuariosDAO.eliminarUsuario(idUsuario);
    console.log('Resultado de la eliminación:', resultadoEliminar);
    const usuarioEliminado = await usuariosDAO.obtenerUsuarioPorId(idUsuario);
    console.log('¿Usuario eliminado existe?:', usuarioEliminado ? 'No' : 'Sí, fue eliminado');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
}


realizarTransacciones();