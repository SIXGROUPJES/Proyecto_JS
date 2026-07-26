import {
    JsonServerNoDisponibleError,
    actualizar,
    crear,
    eliminar,
    obtenerPorId,
    obtenerTareasAsignadasPorUsuario,
    obtenerTodos
} from '../models/usuario.model.js';

const ROLES_PERMITIDOS = new Set(['user', 'admin']);
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textoValido(valor) {
    return typeof valor === 'string' && valor.trim().length > 0;
}

function validarEmail(email) {
    return FORMATO_EMAIL.test(email);
}

function responderError(error, respuesta) {
    if (error instanceof JsonServerNoDisponibleError) {
        return respuesta.status(503).json({
            mensaje: 'El servicio de datos no está disponible'
        });
    }

    console.error('Error interno del backend de usuarios:', error.message);
    return respuesta.status(500).json({
        mensaje: 'Ocurrió un error interno'
    });
}

export async function crearUsuario(solicitud, respuesta) {
    try {
        const { id, name, email } = solicitud.body ?? {};
        const roleRecibido = solicitud.body?.role;
        let role = 'user';

        if (roleRecibido !== undefined && roleRecibido !== null) {
            if (typeof roleRecibido !== 'string') {
                return respuesta.status(400).json({
                    mensaje: 'El role debe ser user o admin'
                });
            }

            role = roleRecibido.trim() || 'user';
        }

        if (!textoValido(id) || !textoValido(name) || !textoValido(email)) {
            return respuesta.status(400).json({
                mensaje: 'id, name y email son obligatorios'
            });
        }

        const usuario = {
            id: id.trim(),
            name: name.trim(),
            email: email.trim(),
            role
        };

        if (!validarEmail(usuario.email)) {
            return respuesta.status(400).json({
                mensaje: 'El formato del email no es válido'
            });
        }

        if (!ROLES_PERMITIDOS.has(usuario.role)) {
            return respuesta.status(400).json({
                mensaje: 'El role debe ser user o admin'
            });
        }

        if (await obtenerPorId(usuario.id)) {
            return respuesta.status(409).json({
                mensaje: 'Ya existe un usuario con ese ID'
            });
        }

        const usuarioCreado = await crear(usuario);
        return respuesta.status(201).json(usuarioCreado);
    } catch (error) {
        return responderError(error, respuesta);
    }
}

export async function obtenerUsuarios(solicitud, respuesta) {
    try {
        const usuarios = await obtenerTodos();
        return respuesta.status(200).json(usuarios);
    } catch (error) {
        return responderError(error, respuesta);
    }
}

export async function obtenerUsuarioPorId(solicitud, respuesta) {
    try {
        const usuario = await obtenerPorId(String(solicitud.params.id));

        if (!usuario) {
            return respuesta.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        return respuesta.status(200).json(usuario);
    } catch (error) {
        return responderError(error, respuesta);
    }
}

export async function actualizarUsuario(solicitud, respuesta) {
    try {
        const id = String(solicitud.params.id);
        const { name, email, role } = solicitud.body ?? {};

        if (
            Object.hasOwn(solicitud.body ?? {}, 'id')
            && String(solicitud.body.id) !== id
        ) {
            return respuesta.status(400).json({
                mensaje: 'El ID del usuario no se puede modificar'
            });
        }

        if (!textoValido(name) || !textoValido(email) || !textoValido(role)) {
            return respuesta.status(400).json({
                mensaje: 'name, email y role son obligatorios'
            });
        }

        const usuarioExistente = await obtenerPorId(id);

        if (!usuarioExistente) {
            return respuesta.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const usuario = {
            id,
            name: name.trim(),
            email: email.trim(),
            role: role.trim()
        };

        if (!validarEmail(usuario.email)) {
            return respuesta.status(400).json({
                mensaje: 'El formato del email no es válido'
            });
        }

        if (!ROLES_PERMITIDOS.has(usuario.role)) {
            return respuesta.status(400).json({
                mensaje: 'El role debe ser user o admin'
            });
        }

        const usuarioActualizado = await actualizar(id, usuario);
        return respuesta.status(200).json(usuarioActualizado);
    } catch (error) {
        return responderError(error, respuesta);
    }
}

export async function eliminarUsuario(solicitud, respuesta) {
    try {
        const id = String(solicitud.params.id);
        const usuario = await obtenerPorId(id);

        if (!usuario) {
            return respuesta.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const tareas = await obtenerTareasAsignadasPorUsuario(id);
        const tareasActivas = tareas.filter(
            (tarea) => tarea.estado !== 'Completada'
        );

        if (tareasActivas.length > 0) {
            return respuesta.status(409).json({
                mensaje: 'No se puede eliminar el usuario porque tiene tareas activas',
                tareasActivas: tareasActivas.length
            });
        }

        await eliminar(id);
        return respuesta.status(200).json({
            mensaje: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        return responderError(error, respuesta);
    }
}
