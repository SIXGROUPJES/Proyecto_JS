import { API_URL } from '../config/api.config.js';

// ============================================
// ELIMINAR TAREA
// ============================================

/**
 * Eliminar tarea
 * 
 * @param {number} idTarea
 */
export async function eliminarTarea(idTarea) {

    try {

        /*
            Petición eliminar
        */
        const respuesta = await fetch(
            `${API_URL}/tareasAsignadas/${idTarea}`,
            {
                method: 'DELETE'
            }
        );

        if (!respuesta.ok) {

            throw new Error(
                'Error al eliminar tarea'
            );

        }

    } catch (error) {

        console.error(
            'Error:',
            error
        );

        throw error;

    }

}
