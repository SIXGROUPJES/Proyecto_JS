import { eliminarTareaAsignada } from './tareasAsignadas.service.js';

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
        await eliminarTareaAsignada(
            idTarea
        );

    } catch (error) {

        console.error(
            'Error:',
            error
        );

        throw error;

    }

}
