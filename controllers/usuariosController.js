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
                return next(new AppError('El correo electrónico ya está registrado', 409));
            }
            const existeTelefono = await UsuarioDAO.obtenerUsuarioPorTelefono(telefono);
            if (existeTelefono) {
                return next(new AppError('El número de teléfono ya está registrado', 409)); 
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

    static async obtenerUsuarios(req, res, next) {
        try {
            const usuarios = await UsuarioDAO.obtenerUsuarios();

            if (!usuarios) {
                next(new AppError('No se encontraron usuarios', 404));
            }

            res.status(200).json(usuarios);
        } catch (error) {
            next(new AppError('Ocurrio un error al obtener los usuarios', 500));
        }
    }

    static async obtenerUsuarioPorId(req, res, next) {
        try {
            const id = req.params.id;
            const usuario = await UsuarioDAO.obtenerUsuarioPorId(id);

            if (!usuario) {
                next(new AppError('No se encontró el usuarios', 404));
            }

            res.status(200).json(usuario);
        } catch (error) {
            next(new AppError('Ocurrio un error al obtener el usuario', 500));
        }
    }

    static async obtenerUsuarioPorCorreo(req, res, next) {
        try {
            const correo = req.query.correo;
            if (!correo) {
                return res.status(400).json({ mensaje: 'Debe proporcionar un correo' });
            }

            const usuario = await UsuarioDAO.obtenerUsuarioPorCorreo(correo);

            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            res.status(200).json(usuario);
        } catch (error) {
            next(error);
        }
    }

    static async actualizarUsuario(req, res, next) {
        try {
            const id = req.params.id;
            const usuarioExists = await UsuarioDAO.obtenerUsuarioPorId(id);

            if (!usuarioExists) {
                next(new AppError('Usuario no encontrado', 404));

            }

            const usuarioData = req.body;

            const usuario = await UsuarioDAO.actualizarUsuario(id, usuarioData);
            res.status(200).json(usuario);

        } catch (error) {
            next(new AppError('Ocurrión un error al actualizar el usuario', 500));
        }
    }

    static async eliminarUsuario(req, res, next) {
        try {
        const idUsuarioABorrar = req.params.id;

        const idUsuarioDelToken = req.usuario.id;

        if (idUsuarioABorrar !== idUsuarioDelToken) {
            return next(new AppError('No tienes permiso para realizar esta acción', 403)); 
        }

        const usuarioExists = await UsuarioDAO.obtenerUsuarioPorId(idUsuarioABorrar);
        if (!usuarioExists) {
            return next(new AppError('Usuario no encontrado', 404));
        }

        await UsuarioDAO.eliminarUsuario(idUsuarioABorrar);
        res.status(200).json({ message: 'Usuario eliminado correctamente' });

        } catch (error) {
            next(new AppError('Ocurrió un error al eliminar el usuario', 500))
        }
    }

    static async iniciarSesion(req, res, next) {
        try {

            const { correo, contrasenia } = req.body;
            const usuario = await UsuarioDAO.iniciarSesion(correo, contrasenia);

            if (!usuario) {
                next(new AppError('Credenciales inválidas', 401));
            }

            // 1. Crea el Payload (la información que guardará el token)
            const payload = {
                id: usuario.id,
                correo: usuario.correo,
            };

            // 2. Firma el token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h' // El token expirará en 1 hora
            });

            // 3. Envía el token al cliente
            res.status(200).json({
                message: 'Usuario iniciado correctamente',
                token: token,
                usuario: usuario // El `toJSON` del modelo ya le quitó la contraseña
            });



            res.status(200).json({ message: 'Usuario iniciado correctamente' });


        } catch (error) {
            next(new AppError('Ocurrión un error al iniciar sesión', 500));
        }
    }

    static async cambiarContrasenia(req, res, next) {
        try {
            const { correo, contrasenia, nuevaContrasenia } = req.body;
            const usuario = await UsuarioDAO.iniciarSesion(correo, contrasenia);

            if (!usuario) {
                next(new AppError(`Usuario no encontrado: ${usuario}`, 404));
            }

            await UsuarioDAO.cambiarContrasenia(correo, contrasenia, nuevaContrasenia);
            res.status(200).json({ message: 'Contraseña cambiada correctamente' });

        } catch (error) {
            next(new AppError("No se pudo cambiar la contraseña", 500))
        }
    }


}

module.exports = UsuariosController;