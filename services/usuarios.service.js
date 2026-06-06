// ============================================
// URL DEL SERVIDOR
// ============================================

import { API_URL } from '../config/api.config.js';


// ============================================
// USUARIO ACTUAL
// ============================================

let usuarioActual = null;


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
