import { API_URL } from '../config/api.config.js';

const USUARIOS_URL = `${API_URL}/usuarios`;

let usuarioActual = null;

async function solicitar(ruta = '', opciones = {}) {
    let respuesta;

    try {
        respuesta = await fetch(`${USUARIOS_URL}${ruta}`, opciones);
    } catch (errorOriginal) {
        const error = new Error('No fue posible conectar con el backend de usuarios');
        error.esErrorConexion = true;
        throw error;
    }

    let datos = null;

    try {
        const contenido = await respuesta.text();
        if (contenido) {
            try {
                datos = JSON.parse(contenido);
            } catch (errorJson) {
                datos = null;
            }
        }
    } catch (errorOriginal) {
        const error = new Error('Se perdió la conexión con el backend de usuarios');
        error.esErrorConexion = true;
        throw error;
    }

    if (!respuesta.ok) {
        const mensaje = datos?.mensaje || `Error HTTP ${respuesta.status} al consultar usuarios`;
        const error = new Error(mensaje);
        error.status = respuesta.status;
        error.tareasActivas = datos?.tareasActivas;
        error.esErrorConexion = false;
        throw error;
    }

    return datos;
}

export async function obtenerUsuarios() {
    const respuesta = await fetch(USUARIOS_URL);

    if (!respuesta.ok) {
        throw new Error('Error al cargar usuarios');
    }

    const usuarios = await respuesta.json();
    return usuarios;
}

export async function buscarUsuario(documentoUsuario) {
    try {
        const respuesta = await fetch(USUARIOS_URL);
        const usuarios = await respuesta.json();
        const usuarioEncontrado = usuarios.find(
            usuario => usuario.id.toString() === documentoUsuario
        );
        return usuarioEncontrado || null;
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        return null;
    }
}

export async function obtenerUsuariosAdmin() {
    const usuarios = await solicitar();

    if (!Array.isArray(usuarios)) {
        throw new Error('El backend devolvió una lista de usuarios inválida');
    }

    return usuarios;
}

export async function obtenerUsuarioPorId(id) {
    return solicitar(`/${encodeURIComponent(String(id))}`);
}

export async function crearUsuario(usuario) {
    const datosUsuario = {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role
    };

    return solicitar('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosUsuario)
    });
}

export async function actualizarUsuario(id, usuario) {
    const datosUsuario = {
        name: usuario.name,
        email: usuario.email,
        role: usuario.role
    };

    return solicitar(`/${encodeURIComponent(String(id))}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosUsuario)
    });
}

export async function eliminarUsuario(id) {
    const resultado = await solicitar(`/${encodeURIComponent(String(id))}`, {
        method: 'DELETE'
    });

    return resultado?.mensaje;
}
