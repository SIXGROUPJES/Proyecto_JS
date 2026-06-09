//import { eliminarTareaAsignada } from '../services/tareasAsignadas.service.js';
import { eliminarTareaAsignada, actualizarTareaAsignada } from '../services/tareasAsignadas.service.js';
import { notificarExito, notificarError } from './notificaciones.ui.js';
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
                    
                    const confirmar = confirm('¿Seguro que deseas eliminar esta tarea asignada?');
                    if (!confirmar) return;

                    try {
                        // 1. Ejecutar el borrado en el servidor
                        await eliminarTareaAsignada(id);
                        
                        // 2. RF03 - Mostrar el aviso flotante de éxito
                        notificarExito('Tarea asignada eliminada exitosamente.');

                        // 3. RECARGA VISUAL: Ejecutar el callback para actualizar la tabla en pantalla
                        if (typeof onTareaEliminada === 'function') {
                            await onTareaEliminada();
                        }

                    } catch (error) {
                        console.error('Error al eliminar tarea asignada:', error);   
                        
                        // RF03 - Mostrar aviso de error si el servidor falla
                        notificarError('No se pudo eliminar la tarea asignada.');
                    }
                
                }
            );

        }); // <- Este es el cierre del forEach de eliminar

    /*
        Eventos editar tarea asignada
        esto es del boton editar de tareas asignadas
        Ely
    
  
    /*
    Ely
       
    Eventos editar tarea asignada (Abrir sección de formulario)
    */
    document
        .querySelectorAll(
            '.boton-editar-asignada'
        )
        .forEach(boton => {

            boton.addEventListener(
                'click',
                (evento) => {
                    // Encontrar el objeto de la tarea correspondiente buscando en el array recibido
                    const id = evento.target.getAttribute('data-id');
                    const tareaSeleccionada = tareas.find(t => t.id == id);

                    if (!tareaSeleccionada) return;

                    // 1. Rellenar los campos de la sección de edición con los datos actuales
                    document.getElementById('editarAsignadaId').value = tareaSeleccionada.id;
                    document.getElementById('editarAsignadaTareaId').value = tareaSeleccionada.tareaId;
                    document.getElementById('editarAsignadaTitulo').value = tareaSeleccionada.titulo;
                    document.getElementById('editarAsignadaDescripcion').value = tareaSeleccionada.descripcion;
                    document.getElementById('editarAsignadaEstado').value = tareaSeleccionada.estado;
                    document.getElementById('editarAsignadaUsuarioId').value = tareaSeleccionada.usuarioId;
                    document.getElementById('editarAsignadaUsuario').value = tareaSeleccionada.usuarioNombre;
                    document.getElementById('dropdownEditarTareaTexto').textContent = tareaSeleccionada.titulo;
                    document.getElementById('dropdownEditarUsuarioTexto').textContent = tareaSeleccionada.usuarioNombre;

                    // 2. Mostrar la sección removiendo la clase 'hidden'
                    const seccionEdicion = document.getElementById('seccionEditarTareaAsignada');
                    seccionEdicion.classList.remove('hidden');

                    // 3. Hacer un scroll suave hacia el formulario para que el usuario note que se abrió
                    seccionEdicion.scrollIntoView({ behavior: 'smooth' });
                }
            );

        });
} // <- Este es el cierre final de la función renderizarTareas "boton editar (tarea asignada)Ely"
