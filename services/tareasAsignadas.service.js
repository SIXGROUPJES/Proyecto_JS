import { API_URL } from '../config/api.config.js';

export async function obtenerTareasAsignadasPorUsuario(usuarioId) {

    const respuesta =
        await fetch(
            `${API_URL}/tareasAsignadas?usuarioId=${encodeURIComponent(String(usuarioId))}`
        );

    if (!respuesta.ok) {

        throw new Error(
            'Error al cargar tareas asignadas'
        );

    }

    const tareas =
        await respuesta.json();

    return tareas;

}

export async function crearTareaAsignada(tareaAsignada) {

    const respuesta =
        await fetch(

            `${API_URL}/tareasAsignadas`,

            {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json'

                },

                body: JSON.stringify(
                    tareaAsignada
                )

            }

        );

    return respuesta;

}

export async function eliminarTareaAsignada(idTarea) {

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

    return respuesta;

}

export async function eliminarTareasAsignadasPorUsuario(usuarioId) {

    const tareas =
        await obtenerTareasAsignadasPorUsuario(
            usuarioId
        );

    for (const tarea of tareas) {

        await eliminarTareaAsignada(
            tarea.id
        );

    }

}
