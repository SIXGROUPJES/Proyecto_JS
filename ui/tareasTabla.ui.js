import { eliminarTareaAsignada } from '../services/tareasAsignadas.service.js';

// ============================================
// RENDERIZAR TAREAS
// ============================================

/**
 * Mostrar tareas en tabla
 * 
 * @param {Array} tareas
 * @param {Function} onTareaEliminada
 */
export function renderizarTareas(tareas, onTareaEliminada) {

    const cuerpoTabla =
        document.getElementById(
            'cuerpoTablaTareas'
        );

    const tabla =
        document.getElementById(
            'tablaTareas'
        );

    const mensaje =
        document.getElementById(
            'mensajeSinTareas'
        );

    /*
        Limpiar tabla
    */
    cuerpoTabla.innerHTML = '';

    /*
        Verificar tareas
    */
    if (tareas.length === 0) {

        tabla.classList.add(
            'hidden'
        );

        mensaje.classList.remove(
            'hidden'
        );

        return;

    }

    /*
        Mostrar tabla
    */
    tabla.classList.remove(
        'hidden'
    );

    tabla.style.display = '';

    mensaje.classList.add(
        'hidden'
    );

    /*
        Recorrer tareas
    */
    tareas.forEach(tarea => {

        /*
            Crear fila
        */
        const fila =
            document.createElement(
                'tr'
            );

        fila.innerHTML = `

        <td>
            ${tarea.titulo}
        </td>

        <td>
            ${tarea.descripcion}
        </td>

        <td>
            ${tarea.estado}
        </td>

        <td>
            ${new Date(
            tarea.fechaAsignacion
        ).toLocaleDateString()}
        </td>

        <td>
            ${tarea.usuarioNombre}
        </td>

        <td>

            <button
                class="boton-eliminar"
                data-id="${tarea.id}"
            >

                Eliminar

            </button>

        </td>
    `;

        /*
            Agregar fila
        */
        cuerpoTabla.appendChild(
            fila
        );

    });

    /*
        Eventos eliminar
    */
    document
        .querySelectorAll(
            '.boton-eliminar'
        )
        .forEach(boton => {

            boton.addEventListener(
                'click',
                async (evento) => {

                    const id =
                        evento.target.getAttribute(
                            'data-id'
                        );

                    await eliminarTareaAsignada(
                        id
                    );

                    if (typeof onTareaEliminada === 'function') {

                        await onTareaEliminada();

                    }

                }
            );

        });

}
