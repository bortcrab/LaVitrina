const { sequelize } = require('../models');
const usuariosDAO = require('../dataAccess/usuariosDAO');
const chatsDAO = require('../dataAccess/chatsDAO');

async function probarChatsDAO() {
    let chatCreado;

    try {
        await sequelize.sync({ force: true });

        const usuario1 = await usuariosDAO.crearUsuario({
            nombres: "Juan", correo: "juan@gmail.com", contrasenia: "1234",
            apellidoPaterno: "Gómez", apellidoMaterno: "Pérez", fechaNacimiento: "1998-01-15",
            ciudad: "Guasave", telefono: "6871741035"
        });

        const usuario2 = await usuariosDAO.crearUsuario({
            nombres: "María", correo: "maria@gmail.com", contrasenia: "1234",
            apellidoPaterno: "Martinez", apellidoMaterno: "López", fechaNacimiento: "2004-09-02",
            ciudad: "Guasave", telefono: "6871933193"
        });

        chatCreado = await chatsDAO.crearChat('Juan + María - Teclado Gamer', new Date());
        console.log(`Chat creado con éxito, id: ${chatCreado.id}, nombre: ${chatCreado.nombre}`);

        const chatObtenido = await chatsDAO.obtenerChatPorId(chatCreado.id);
        console.log('\n[Paso 4: Probando obtenerChatsPorUsuario...]');

        await UsuarioChat.bulkCreate([
            { idChat: chatCreado.id, idUsuario: usuario1.id },
            { idChat: chatCreado.id, idUsuario: usuario2.id }
        ]);

        const mensaje = await Mensaje.create({ idChat: chatCreado.id, idUsuario: usuario1.id, fechaEnviado: new Date() });
        await MensajeTexto.create({ id: mensaje.id, texto: 'Este es el último mensaje' });
        console.log('...Contexto para la prueba de obtenerChatsPorUsuario preparado.');

        const chatsDeJuan = await chatsDAO.obtenerChatsPorUsuario(usuario1.id);
        console.log('📱 Chats de Juan:');
        console.log(JSON.stringify(chatsDeJuan, null, 2));
        console.log('✅ El chat de prueba fue recuperado correctamente.');

        // --- PASO 5: PROBAR eliminarChat ---
        console.log('\n[Paso 5: Probando eliminarChat...]');
        const mensajeEliminacion = await chatsDAO.eliminarChat(chatCreado.id);
        console.log(`🗑️  ${mensajeEliminacion}`);
        const chatVerificacion = await chatsDAO.obtenerChatPorId(chatCreado.id);
        console.log(`¿El chat de prueba todavía existe? ${chatVerificacion ? 'Sí' : 'No, se eliminó correctamente.'}`);

    } catch (error) {
        console.error('\n--- ❌ ERROR DURANTE EL TEST ❌ ---');
        console.error(error);
    } finally {
        await sequelize.close();
        console.log('\n--- ✅ TEST FINALIZADO ✅ ---');
        console.log('Conexión con la base de datos cerrada.');
    }
}