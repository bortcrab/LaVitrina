const UsuarioDAO = require('../dataAccess/usuariosDAO.js');
const { AppError } = require('../utils/appError.js');

class UsuariosController {
    static async crearUsuario(req, res, next) {
        try {
            const { nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento, ciudad, correo, contrasenia, telefono, fotoPerfil } = req.body;

            if (!nombres || !apellidoPaterno || !apellidoMaterno || !fechaNacimiento || !ciudad || !correo || !contrasenia || !telefono) {
                return next(new AppError('Campos requeridos (nombres, apellidos, fechaNacimiento, ciudad, correo, contrasenia, telefono) faltantes', 400));
            }

            const existeCorreo = await UsuarioDAO.obtenerUsuarioPorCorreo(correo);
            if (existeCorreo) {
                return next(new AppError('El correo electrónico ya está registrado', 409)); // 409 Conflict
            }

            const usuarioData = {
                nombres,
                apellidoPaterno,
                apellidoMaterno,
                fechaNacimiento,
                ciudad,
                correo,
                contrasenia,
                telefono,
                fotoPerfil
            };

            const nuevoUsuario = await UsuarioDAO.crearUsuario(usuarioData);

            res.status(200).json(nuevoUsuario);
        } catch (error) {
            next(new AppError('Ocurrión un error al crear el usuario', 500));
        }
    }

    static async obtenerUsuarios(req, res, next){
        try {
            const usuarios = await UsuarioDAO.obtenerUsuarios();

            if(!usuarios){
                next(new AppError('No se encontraron usuarios',404));
            }

            res.status(200).json(producto);
        } catch (error) {
            next(new AppError('Ocurrio un error al obtener los usuarios', 500));
        }
    }

    static async obtenerUsuarioPorId(req, res, next){
        try {
            
        } catch (error) {
            
        }
    }


}

module.exports = UsuariosController;