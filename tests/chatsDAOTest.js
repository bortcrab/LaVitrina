const { sequelize } = require('../models');
const usuariosDAO = require('../dataAccess/usuariosDAO.js');
const chatsDAO = require('../dataAccess/chatsDAO.js');
const mensajesDAO = require('../dataAccess/mensajesDAO.js');
const usuarioChatsDAO = require('../dataAccess/usuarioChatsDAO.js');

async function chatsDAOTest() {
    try {
        await sequelize.sync({ force: true });

        // Contexto de la prueba
        console.log('\n--- Creando contexto de prueba (usuario) ---');
        const testUser = await usuariosDAO.crearUsuario({
            nombres: "Victoria",
            correo: "victoriavegabe@gmail.com",
            contrasenia: "12345",
            apellidoPaterno: "Vega",
            apellidoMaterno: "Bernal",
            fechaNacimiento: "2004-09-02",
            ciudad: "Guasave",
            telefono: "6871741035"
        });

        // Prueba crear chat
        console.log('\n--- Probando crearChat ---');
        const testChat = await chatsDAO.crearChat('Victoria + Abel - Teclado gamer', new Date());
        console.log('Chat creado:', testChat.toJSON());

        // Prueba obtener chat por id
        console.log('\n--- Probando obtenerChatPorId ---');
        const chatEncontrado = await chatsDAO.obtenerChatPorId(testChat.id);
        console.log('Chat encontrado:', chatEncontrado.toJSON());

        // Prueba obtener chats por usuario
        console.log('\n--- Probando obtenerChatsPorUsuario ---');
        await usuarioChatsDAO.agregarUsuarioAChat(testUser.id, testChat.id);
        await mensajesDAO.crearMensaje(testChat.id, testUser.id, { texto: 'Último mensaje de prueba' });

        const chatsDelUsuario = await chatsDAO.obtenerChatsPorUsuario(testUser.id);

        console.log(`Se encontraron ${chatsDelUsuario.length} chats del usuario.`);
        console.log('Chats encontrados:', JSON.stringify(chatsDelUsuario, null, 2));

        // Prueba eliminar chat
        console.log('\n--- Probando eliminarChat ---');
        const resultadoEliminar = await chatsDAO.eliminarChat(testChat.id);
        console.log('Resultado de la eliminación:', resultadoEliminar);
        const chatVerificacion = await chatsDAO.obtenerChatPorId(testChat.id);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
        console.log('Conexión cerrada.');
    }
}

chatsDAOTest();