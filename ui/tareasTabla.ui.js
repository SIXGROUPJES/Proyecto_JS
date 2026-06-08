//import { eliminarTareaAsignada } from '../services/tareasAsignadas.service.js';
import { eliminarTareaAsignada, actualizarTareaAsignada } from '../services/tareasAsignadas.service.js';
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
                class="boton-editar-asignada"
                data-id="${tarea.id}"
                data-titulo="${tarea.titulo}"
                data-estado="${tarea.estado}"
                style="background-color: #f1c40f; color: white; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; margin-right: 10px;"
            >
                Editar
            </button>

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

        }); // <- Este es el cierre del forEach de eliminar

    /*
        Eventos editar tarea asignada
        esto es del boton editar de tareas asignadas
        Ely
    */
    document
        .querySelectorAll(
            '.boton-editar-asignada'
        )
        .forEach(boton => {

            boton.addEventListener(
                'click',
                async (evento) => {

                    const id = evento.target.getAttribute('data-id');
                    const titulo = evento.target.getAttribute('data-titulo');
                    const estadoActual = evento.target.getAttribute('data-estado');

                    const nuevoEstado = prompt(
                        `Modificar estado para la tarea: "${titulo}"\n\nEscriba el nuevo estado exactamente:\n- Pendiente\n- En progreso\n- Completada`,
                        estadoActual
                    );

                    if (!nuevoEstado) return;

                    const estadoFormateado = nuevoEstado.trim();

                    if (
                        estadoFormateado !== 'Pendiente' && 
                        estadoFormateado !== 'En progreso' && 
                        estadoFormateado !== 'Completada'
                    ) {
                        alert('Estado inválido. Por favor escribe: Pendiente, En progreso o Completada.');
                        return;
                    }

                    try {
                        await actualizarTareaAsignada(id, { estado: estadoFormateado });

                        // Usamos la misma función de recarga que pasaron por parámetro
                        if (typeof onTareaEliminada === 'function') {
                            await onTareaEliminada();
                        }
                    } catch (error) {
                        console.error(error);
                        alert('No se pudo actualizar el estado.');
                    }

                }
            );

        });

} // <- Este es el cierre final de la función renderizarTareas "boton editar (tarea asignada)Ely"


