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
        await fetch(
            `${API_URL}/tareasAsignadas/${idTarea}`,
            {
                method: 'DELETE'
            }
        );

        /*
            Recargar tareas
        */
        cargarTareasUsuario(
            usuarioActual.id
        );

    } catch (error) {

        console.error(
            'Error:',
            error
        );

    }

}
