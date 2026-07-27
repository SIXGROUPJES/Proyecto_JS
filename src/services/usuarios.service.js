// ============================================
// URL DEL SERVIDOR
// ============================================

import { API_URL } from '../config/api.config.js';

const USUARIOS_ADMIN_URL =
    `http://${window.location.hostname}:3001/api/usuarios`;


// ============================================
// PETICIONES AL BACKEND DE ADMINISTRACIÓN
// ============================================

async function solicitarAdministracion(ruta = '', opciones = {}) {

    let respuesta;

    try {

        respuesta = await fetch(
            `${USUARIOS_ADMIN_URL}${ruta}`,
            opciones
        );

    } catch (errorOriginal) {

        const error = new Error(
            'No fue posible conectar con el backend de usuarios'
        );

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

        const error = new Error(
            'Se perdió la conexión con el backend de usuarios'
        );

        error.esErrorConexion = true;

        throw error;

    }

    if (!respuesta.ok) {

        const mensaje =
            datos?.mensaje ||
            `Error HTTP ${respuesta.status} al consultar usuarios`;

        const error = new Error(mensaje);

        error.status = respuesta.status;
        error.tareasActivas = datos?.tareasActivas;
        error.esErrorConexion = false;

        throw error;

    }

    return datos;

}


// ============================================
// USUARIO ACTUAL
// ============================================

let usuarioActual = null;


// ============================================
// OBTENER USUARIOS
// ============================================

/**
 * Obtener todos los usuarios
 *
 * @returns {Array}
 */
export async function obtenerUsuarios() {

    const respuesta =
        await fetch(
            `${API_URL}/usuarios`
        );

    if (!respuesta.ok) {

        throw new Error(
            'Error al cargar usuarios'
        );

    }

    const usuarios =
        await respuesta.json();

    return usuarios;

}


// ============================================
// BUSCAR USUARIO
// ============================================

/**
 * Buscar usuario por documento
 * 
 * @param {string} documentoUsuario
 * @returns {Object|null}
 */
export async function buscarUsuario(documentoUsuario) {

    try {

        /*
            Petición al servidor
        */
        const respuesta =
            await fetch(
                `${API_URL}/usuarios`
            );

        /*
            Convertimos respuesta
        */
        const usuarios =
            await respuesta.json();

        /*
            Buscar usuario
        */
        const usuarioEncontrado =
            usuarios.find(
                usuario =>
                    usuario.id.toString() ===
                    documentoUsuario
            );

        /*
            Retornar usuario
        */
        return usuarioEncontrado || null;

    } catch (error) {

        console.error(
            'Error al buscar usuario:',
            error
        );

        return null;

    }

}


// ============================================
// ADMINISTRACIÓN DE USUARIOS
// ============================================

export async function obtenerUsuariosAdmin() {

    const usuarios =
        await solicitarAdministracion();

    if (!Array.isArray(usuarios)) {

        throw new Error(
            'El backend devolvió una lista de usuarios inválida'
        );

    }

    return usuarios;

}

export async function obtenerUsuarioPorId(id) {

    return solicitarAdministracion(
        `/${encodeURIComponent(String(id))}`
    );

}

export async function crearUsuario(usuario) {

    const datosUsuario = {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role
    };

    return solicitarAdministracion(
        '',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        }
    );

}

export async function actualizarUsuario(id, usuario) {

    const datosUsuario = {
        name: usuario.name,
        email: usuario.email,
        role: usuario.role
    };

    return solicitarAdministracion(
        `/${encodeURIComponent(String(id))}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        }
    );

}

export async function eliminarUsuario(id) {

    const resultado =
        await solicitarAdministracion(
            `/${encodeURIComponent(String(id))}`,
            {
                method: 'DELETE'
            }
        );

    return resultado?.mensaje;

}
