const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

/**
 * Clase que maneja el acceso a datos para la entidad Usuario.
 * Proporciona métodos para realizar operaciones CRUD y autenticación de usuarios.
 */
class UsuarioDAO {
    constructor() { }

    /**
     * Crea un nuevo usuario en la base de datos.
     * @param {Object} datosUsuario - Datos del usuario a crear.
     * @param {string} datosUsuario.contrasenia - Contraseña sin hashear del usuario.
     * @returns {Promise<Object>} El usuario creado.
     * @throws {Error} Si hay un error durante la creación.
     */
    async crearUsuario(datosUsuario) {
        try {
            const contraseniaHasheada = bcrypt.hashSync(datosUsuario.contrasenia, 10)
            const usuario = await Usuario.create({
                ...datosUsuario,
                contrasenia: contraseniaHasheada
            });
            return usuario;
        } catch (error) {

            throw error;

        }
    }

    /**
     * Obtiene todos los usuarios de la base de datos.
     * @returns {Promise<Array>} Lista de todos los usuarios.
     * @throws {Error} Si hay un error durante la consulta.
     */
    async obtenerUsuarios() {
        try {
            const usuarios = await Usuario.findAll();
            return usuarios;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Busca un usuario por su ID.
     * @param {number} idUsuario - ID del usuario a buscar.
     * @returns {Promise<Object|null>} El usuario encontrado o null si no existe.
     * @throws {Error} Si hay un error durante la consulta.
     */
    async obtenerUsuarioPorId(idUsuario) {
        try {
            const usuario = await Usuario.findByPk(idUsuario);
            return usuario;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Busca un usuario por su correo electrónico.
     * @param {string} correo - Correo electrónico del usuario a buscar.
     * @returns {Promise<Object|null>} El usuario encontrado o null si no existe.
     * @throws {Error} Si hay un error durante la consulta.
     */
    async obtenerUsuarioPorCorreo(correo) {
        try {
            const usuario = await Usuario.findOne({ where: { correo } });

            if (!usuario) {
                console.log("Intento de inicio de sesión fallido: correo no encontrado");
                return null;
            }
            return usuario;
        } catch (error) {
            console.log("Error en el proceso de Obtener usuario por correo", error);
            throw error;
        }
    }

    /**
     * Busca un usuario por su número de teléfono.
     * @param {string} telefono - Teléfono del usuario a buscar.
     * @returns {Promise<Object|null>} El usuario encontrado o null si no existe.
     */
    async obtenerUsuarioPorTelefono(telefono) {
        try {
            const usuario = await Usuario.findOne({ where: { telefono } });
            // No es necesario un console.log aquí, solo devolvemos el resultado
            return usuario;
        } catch (error) {
            console.log("Error en el proceso de Obtener usuario por teléfono", error);
            throw error;
        }
    }

    /**
     * Actualiza los datos de un usuario existente.
     * @param {number} id - ID del usuario a actualizar.
     * @param {Object} datosActualizacion - Nuevos datos del usuario.
     * @param {string} [datosActualizacion.contrasenia] - Nueva contraseña (opcional).
     * @returns {Promise<Object>} El usuario actualizado.
     * @throws {Error} Si hay un error durante la actualización.
     */
    async actualizarUsuario(id, datosActualizacion) {
        try {

            if (datosActualizacion.contrasenia) {
                datosActualizacion.contrasenia = bcrypt.hashSync(datosActualizacion.contrasenia, 10);
            }
            await Usuario.update(datosActualizacion, { where: { id } });
            const usuarioActualizado = await Usuario.findByPk(id);
            return usuarioActualizado;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Elimina un usuario de la base de datos.
     * @param {number} id - ID del usuario a eliminar.
     * @returns {Promise<string>} Mensaje de confirmación.
     * @throws {Error} Si el usuario no existe o hay un error durante la eliminación.
     */
    async eliminarUsuario(id) {
        try {
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            await usuario.destroy();
            return "Usuario eliminado con éxito";
        } catch (error) {
            throw error;
        }
    }

    /**
     * Valida las credenciales de un usuario para iniciar sesión.
     * @param {string} correo - Correo electrónico del usuario.
     * @param {string} contrasenia - Contraseña del usuario.
     * @returns {Promise<Object|null>} El usuario si las credenciales son válidas, null en caso contrario.
     * @throws {Error} Si hay un error durante la validación.
     */
    async iniciarSesion(correo, contrasenia) {
        try {
            const usuario = await Usuario.findOne({ where: { correo } });

            if (!usuario) {
                console.log("Intento de inicio de sesión fallido: correo no encontrado");
                return null;
            }
            const esConstraseniaValida = bcrypt.compareSync(contrasenia, usuario.contrasenia);

            if (esConstraseniaValida) {
                console.log(`Inicio de sesión exitoso para el usuario: ${usuario.correo}`);
                return usuario;
            }
            else {
                console.log(`Intengo de inicio de sesióni fallido para: ${usuario.correo}`);
                return null;
            }

        } catch (error) {
            console.error("Error en el proceso de inicio de sesión", error);
            throw error;
        }
    }
    /**
     * Cambia la contraseña de un usuario, verificando primero la contraseña actual.
     * @param {string} correo - Correo del usuario cuya contraseña se cambiará.
     * @param {string} contraseniaActual - Contraseña actual del usuario para verificación.
     * @param {string} nuevaContrasenia - Nueva contraseña a establecer.
     * @returns {Promise<boolean>} Retorna `true` si el cambio fue exitoso, `false` si la contraseña actual es incorrecta.
     * @throws {Error} Si el usuario no se encuentra o si ocurre un error en la base de datos.
     */
    async cambiarContrasenia(correo, contraseniaActual, nuevaContrasenia) {
        try {
            const usuario = await this.obtenerUsuarioPorCorreo(correo);
            const esContraseniaValida = bcrypt.compareSync(contraseniaActual, usuario.contrasenia);
            if (!esContraseniaValida) {
                console.log("Intendo de cambio de constraseña fallido: contraseña actual.");
                return false;
            }

            //Hashear la nueva contraseña (el 10 solo es el peso de hashear)
            const nuevaContraseniaHasheada = bcrypt.hashSync(nuevaContrasenia, 10);

            await Usuario.update(
                { contrasenia: nuevaContraseniaHasheada },
                { where: { correo: correo } }
            )

            return true;

        } catch (error) {
            console.log("Error en el proceso de cambiar contraseña");
            throw error;
        }
    }

}


module.exports = new UsuarioDAO();