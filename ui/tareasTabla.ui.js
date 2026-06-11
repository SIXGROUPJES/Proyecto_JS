import { eliminarTareaAsignada } from '../services/tareasAsignadas.service.js';
import { 
    exportarAJsonDescargable 
} from '../services/exportador.service.js';
   import { 
    notificarExito, 
    notificarError 
} from './notificaciones.ui.js';
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
    const botonExportar = 
        document.getElementById(
            'botonExportarJson'
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
        if (botonExportar) botonExportar.classList.add('hidden');

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

    // Si hay tareas visibles, mostramos el botón de exportar
    if (botonExportar) {
        botonExportar.classList.remove('hidden');
        
        // Asignación directa y limpia que no rompe los otros botones de la tabla
        botonExportar.onclick = () => {
            try {
                const nombreUsuario = tareas[0]?.usuarioNombre || 'usuario';
                const nombreArchivo = `tareas_${nombreUsuario.toLowerCase().replace(/\s+/g, '_')}.json`;
                
                exportarAJsonDescargable(tareas, nombreArchivo);
                notificarExito('¡Archivo JSON descargado con éxito! 📥');
            } catch (error) {
                console.error(error);
                notificarError('No se pudieron exportar las tareas visibles.');
            }
        };
    }

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
                (evento) => {
                    const id = evento.target.getAttribute('data-id');
                    const tareaSeleccionada = tareas.find(t => t.id == id);

                    if (!tareaSeleccionada) return;

                    // 1. Rellenar los campos de la sección de edición inferior
                    document.getElementById('editarAsignadaId').value = tareaSeleccionada.id;
                    document.getElementById('editarAsignadaTareaId').value = tareaSeleccionada.tareaId || '';
                    document.getElementById('editarAsignadaTitulo').value = tareaSeleccionada.titulo;
                    document.getElementById('editarAsignadaDescripcion').value = tareaSeleccionada.descripcion;
                    document.getElementById('editarAsignadaEstado').value = tareaSeleccionada.estado;
                    document.getElementById('editarAsignadaUsuarioId').value = tareaSeleccionada.usuarioId || '';
                    document.getElementById('editarAsignadaUsuario').value = tareaSeleccionada.usuarioNombre;

                    // 2. Mostrar la sección removiendo la clase 'hidden'
                    const seccionEdicion = document.getElementById('seccionEditarTareaAsignada');
                    if (seccionEdicion) {
                        seccionEdicion.classList.remove('hidden');
                        // 3. Desplazamiento suave al formulario
                        seccionEdicion.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            );

        });

} // <- Este es el cierre final de la función renderizarTareas "boton editar (tarea asignada)Ely"


