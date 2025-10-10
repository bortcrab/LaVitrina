const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

class UsuarioDAO {
    constructor() { }

    async crearUsuario(datosUsuario) {
        try {
            const contraseniaHasheada = bcrypt.hashSync(datosUsuario.contrasenia, 10)
            const usuario = await Usuario.create({
                // Usamos todos los datos del objeto
                ...datosUsuario,
                // Y reemplazamos la contraseña por la versión hasheada
                contrasenia: contraseniaHasheada 
            });
            return usuario;
        } catch (error) {
            throw error;
        }
    }

    async obtenerUsuarios() {
        try {
            const usuarios = await Usuario.findAll();
            return usuarios;
        } catch (error) {
            throw error;
        }
    }

    async obtenerUsuarioPorId(idUsuario) {
        try {
            const usuario = await Usuario.findByPk(idUsuario);
            return usuario;
        }       catch (error) {
            throw error;
        }
    }

    async obtenerUsuarioPorCorreo(correo){
        try {
            const usuario = await Usuario.findOne({where:{correo}});

            if(!usuario){
                console.log("Intento de inicio de sesión fallido: correo no encontrado");
                return null;
            }
            return usuario;
        } catch (error) {
            console.log("Error en el proceso de Obtener usuario por correo", error);
            throw error;
        }
    }

    async actualizarUsuario(id,datosActualizacion){
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

    async eliminarUsuario(id){
        try {
            const usuario = await Usuario.findByPk(id);
            if(!usuario){
                throw new Error('Usuario no encontrado');
            }    
            await usuario.destroy();
            return "Usuario eliminado con éxito";
        } catch (error) {
            throw error;
        }
    }

    async iniciarSesion(correo, contrasenia){
        try {
            const usuario = await Usuario.findOne({where:{correo}});

            if(!usuario){
                console.log("Intento de inicio de sesión fallido: correo no encotnrado");
                return null;
            }
            const esConstraseniaValida = bcrypt.compareSync(contrasenia, usuario.contrasenia);

            if(esConstraseniaValida){
                console.log(`Inicio de sesión exitoso para el usuario: ${usuario.correo}`);
                return usuario;
            }
            else{
                console.log(`Intengo de inicio de sesióni fallido para: ${usuario.correo}`);
                return null;
            }

        } catch (error) {
            console.error("Error en el proceso de inicio de sesión", error);
            throw error;
        }
    }

    async cambiarContrasenia(correo, contraseniaActual, nuevaContrasenia){
        try {
            const usuario = await this.obtenerUsuarioPorCorreo(correo);
            const esContraseniaValida = bcrypt.compareSync(contraseniaActual, usuario.contrasenia);
            if(!esContraseniaValida){
                console.log("Intendo de cambio de constraseña fallido: contraseña actual.");
                return false;
            }

            //Hashear la nueva contraseña (el 10 solo es el peso de hashear)
            const nuevaContraseniaHasheada = bcrypt.hashSync(nuevaContrasenia, 10);

            await Usuario.update(
                {contrasenia: nuevaContraseniaHasheada},
                {where:{correo:correo}}
            )

            return true;

        } catch (error) {
            console.log("Error en el proceso de cambiar contraseña");
            throw error;
        }
    }

}


module.exports = new UsuarioDAO();