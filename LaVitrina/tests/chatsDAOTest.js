const { sequelize } = require('../models');
const usuariosDAO = require('../dataAccess/usuariosDAO.js');
const chatsDAO = require('../dataAccess/chatsDAO.js');
const mensajesDAO = require('../dataAccess/mensajesDAO.js');
const usuarioChatsDAO = require('../dataAccess/usuarioChatsDAO.js');

// Función para probar todas las funciones de la clase chatsDAO
async function chatsDAOTest() {
    try {
        await sequelize.sync({ force: true });

        // Contexto de la prueba
        console.log('\n--- Creando contexto de prueba (usuario) ---');
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

        // Prueba crear chat
        console.log('\n--- Probando crearChat ---');
        const chatPrueba = await chatsDAO.crearChat('Victoria + Abel - Teclado gamer', new Date());
        console.log('Chat creado:', chatPrueba.toJSON());

        // Prueba obtener chat por id
        console.log('\n--- Probando obtenerChatPorId ---');
        const chatEncontrado = await chatsDAO.obtenerChatPorId(chatPrueba.id);
        console.log('Chat encontrado:', chatEncontrado.toJSON());

        // Prueba obtener chats por usuario
        console.log('\n--- Probando obtenerChatsPorUsuario ---');
        await usuarioChatsDAO.agregarUsuarioAChat(usuarioPrueba.id, chatPrueba.id);
        await mensajesDAO.crearMensaje(chatPrueba.id, usuarioPrueba.id, { texto: 'Hola me interesa el teclado gamer' });

        const chatsDelUsuario = await chatsDAO.obtenerChatsPorUsuario(usuarioPrueba.id);

        console.log(`Se encontraron ${chatsDelUsuario.length} chats del usuario.`);
        console.log('Chats encontrados:', JSON.stringify(chatsDelUsuario, null, 2));

        // Prueba eliminar chat
        console.log('\n--- Probando eliminarChat ---');
        const resultadoEliminar = await chatsDAO.eliminarChat(chatPrueba.id);
        console.log('Resultado de la eliminación:', resultadoEliminar);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
        console.log('Conexión cerrada.');
    }
}

chatsDAOTest();