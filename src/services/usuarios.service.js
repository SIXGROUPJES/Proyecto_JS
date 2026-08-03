// ============================================
// SERVICIO: USUARIOS
// ============================================
// Capa de comunicación con la API para el CRUD de usuarios.
// Incluye un helper "solicitar" que centraliza el fetch, la
// conversión a JSON y el manejo de errores (incluye los 409 del
// backend con el detalle de tareas activas).
import { API_URL } from '../config/api.config.js';

const USUARIOS_URL = `${API_URL}/usuarios`;

let usuarioActual = null;

// ============================================
// CLIENTE HTTP GENÉRICO
// ============================================
// Ejecuta el fetch, parsea la respuesta (incluso vacía) y lanza
// errores descriptivos si el backend no responde o devuelve error.
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

// ============================================
// OPERACIONES CRUD
// ============================================

// Listar todos los usuarios (para el autocompletado y la administración).
export async function obtenerUsuarios() {
    const respuesta = await fetch(USUARIOS_URL);

    if (!respuesta.ok) {
        throw new Error('Error al cargar usuarios');
    }

    const usuarios = await respuesta.json();
    return usuarios;
}

// Buscar un usuario por su documento: descarga la lista y la recorre
// comparando el id en texto (así no hay problemas entre número y string).
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

// Listar usuarios para la tabla de administración (usa el cliente genérico).
export async function obtenerUsuariosAdmin() {
    const usuarios = await solicitar();

    if (!Array.isArray(usuarios)) {
        throw new Error('El backend devolvió una lista de usuarios inválida');
    }

    return usuarios;
}

// Buscar un usuario por ID en el backend (ruta /usuarios/:id).
export async function obtenerUsuarioPorId(id) {
    return solicitar(`/${encodeURIComponent(String(id))}`);
}

// Crear un usuario nuevo.
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

// Actualizar un usuario (el ID no se envía porque no se puede modificar).
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

// Eliminar un usuario; devuelve el mensaje del backend.
export async function eliminarUsuario(id) {
    const resultado = await solicitar(`/${encodeURIComponent(String(id))}`, {
        method: 'DELETE'
    });

    return resultado?.mensaje;
}
