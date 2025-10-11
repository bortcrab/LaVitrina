const { sequelize } = require('../models');
const mensajesDAO = require('../dataAccess/mensajesDAO');
const usuariosDAO = require('../dataAccess/usuariosDAO');
const chatsDAO = require('../dataAccess/chatsDAO');

async function mensajesDAOTest() {
    try {
        await sequelize.sync({ force: true });

        // Contexto de la prueba
        console.log('\n--- Creando contexto de prueba (usuario y chat) ---');
        const usuarioPrueba = await usuariosDAO.crearUsuario({
            nombres: "Victoria",
            correo: "victoriavegabe@gmail.com",
            contrasenia: "12345",
            apellidoPaterno: "Vega",
            apellidoMaterno: "Bernal",
            fechaNacimiento: "2004-09-02",
            ciudad: "Guasave",
            telefono: "6871741035"
        });
        const chatPrueba = await chatsDAO.crearChat('Victoria + Abel - Teclado gamer', new Date());

        // Prueba crear mensaje
        console.log('\n--- Probando crearMensaje ---');
        const mensajePruebaTexto = await mensajesDAO.crearMensaje(chatPrueba.id, usuarioPrueba.id, { texto: 'Hola me interesa el teclado gamer' });
        const mensajePruebaImagen = await mensajesDAO.crearMensaje(chatPrueba.id, usuarioPrueba.id, { imagen: 'url/imagenTeclado.jpg' });
        console.log('Mensaje texto:', mensajePruebaTexto.toJSON());
        console.log('Mensaje imagen:', mensajePruebaImagen.toJSON());

        // Prueba obtener mensaje por id
        console.log('\n--- Probando obtenerMensajePorId ---');
        const mensajeEncontrado = await mensajesDAO.obtenerMensajePorId(mensajePruebaTexto.id);
        console.log('Mensaje encontrado:', mensajeEncontrado.toJSON());

        // Prueba obtener mensajes de chat
        console.log('\n--- Probando obtenerMensajesDeChat ---');
        const mensajesChat = await mensajesDAO.obtenerMensajesDeChat(chatPrueba.id);
        console.log(`${mensajesChat.length} mensajes encontrados.`);
        console.log('Mensajes:', JSON.stringify(mensajesChat, null, 2));

        // Prueba eliminar mensaje
        console.log('\n--- Probando eliminarMensaje ---');
        const resultadoEliminar = await mensajesDAO.eliminarMensaje(mensajePruebaTexto.id);
        console.log('Resultado de la eliminación:', resultadoEliminar);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
        console.log('Conexión cerrada.');
    }
}

mensajesDAOTest();