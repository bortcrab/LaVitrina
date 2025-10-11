const { sequelize } = require('../models');
const usuarioChatsDAO = require('../dataAccess/usuarioChatsDAO');
const usuariosDAO = require('../dataAccess/usuariosDAO');
const chatsDAO = require('../dataAccess/chatsDAO');

async function usuariochatsDAOTest() {
    try {
        await sequelize.sync({ force: true });

        // Contexto
        console.log('\n--- Creando contexto de prueba (usuarios y chat) ---');
        const usuario = await usuariosDAO.crearUsuario({
            nombres: "Victoria",
            correo: "victoriavegabe@gmail.com",
            contrasenia: "12345",
            apellidoPaterno: "Vega",
            apellidoMaterno: "Bernal",
            fechaNacimiento: "2004-09-02",
            ciudad: "Guasave",
            telefono: "6871741035"
        });

        const usuario2 = await usuariosDAO.crearUsuario({
            nombres: "Ana",
            correo: "ana.garcia@email.com",
            contrasenia: "ana123",
            apellidoPaterno: "García",
            apellidoMaterno: "Salas",
            fechaNacimiento: "1998-05-15",
            ciudad: "Navojoa",
            telefono: "6441234567",
        });
        const chatPrueba = await chatsDAO.crearChat('Victoria + Ana - Teclado Gamer', new Date());

        // Prueba agregar usuario a chat
        console.log('\n--- Probando agregarUsuarioAChat ---');
        const relacion = await usuarioChatsDAO.agregarUsuarioAChat(usuario.id, chatPrueba.id);
        await usuarioChatsDAO.agregarUsuarioAChat(usuario2.id, chatPrueba.id);
        console.log('Relación creada:', relacion.toJSON());

        // Prueba eliminar usuarios de chat
        console.log('\n--- Probando eliminarUsuarioDeChat ---');
        const resultadoEliminar = await usuarioChatsDAO.eliminarUsuarioDeChat(usuario.id, chatPrueba.id);
        console.log('Resultado de la eliminación:', resultadoEliminar);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
        console.log('Conexión cerrada.');
    }
}

usuariochatsDAOTest();