//import { eliminarTareaAsignada } from '../services/tareasAsignadas.service.js';
import { eliminarTareaAsignada, actualizarTareaAsignada } from '../services/tareasAsignadas.service.js';
import { notificarExito, notificarError } from './notificaciones.ui.js';
import { obtenerUsuarios } from '../services/usuarios.service.js';
// ============================================
// RENDERIZAR TAREAS
// ============================================

/**
 * Mostrar tareas en tabla
 * 
 * @param {Array} tareas
 * @param {Function} onTareaEliminada
 */
let _todasLasTareas = [];
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
    //Guardar copia y poblar desplegables
    _todasLasTareas = tareas;
    poblarFiltroNombres(tareas);
    poblarFiltroUsuarios();

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

//  funcion de filtro de taras

/**
 * Poblar desplegable de nombres de tareas
 * @param {Array} tareas
 */
function poblarFiltroNombres(tareas) {
    const sel = document.getElementById('filtroNombre');
    if (!sel) return;
    const nombres = [...new Set(tareas.map(t => t.titulo))];
    sel.innerHTML = '<option value="Todas">Todas</option>';
    nombres.forEach(nombre => {
        const op = document.createElement('option');
        op.value = nombre;
        op.textContent = nombre;
        sel.appendChild(op);
    });
}

/**
 * Poblar desplegable de usuarios
 * @param {Array} tareas
 */
async function poblarFiltroUsuarios() {
    const sel = document.getElementById('filtroUsuario');
    if (!sel) return;

    try {
        const usuarios = await obtenerUsuarios();
        sel.innerHTML = '<option value="Todos">Todos</option>';
        usuarios.forEach(usuario => {
            const op = document.createElement('option');
            op.value = usuario.name;
            op.textContent = usuario.name;
            sel.appendChild(op);
        });
    } catch (error) {
        console.error('Error al cargar usuarios en filtro:', error);
    }
}

/**
 * Leer los selectores y actualizar la tabla sin llamar al servidor
 */
function aplicarFiltros() {
    const estado  = document.getElementById('filtroEstado')?.value  || 'Todas';
    const nombre  = document.getElementById('filtroNombre')?.value  || 'Todas';
    const usuario = document.getElementById('filtroUsuario')?.value || 'Todos';

    const resultado = _todasLasTareas.filter(tarea => {
        const pasaEstado  = estado  === 'Todas' || tarea.estado        === estado;
        const pasaNombre  = nombre  === 'Todas' || tarea.titulo        === nombre;
        const pasaUsuario = usuario === 'Todos' || tarea.usuarioNombre === usuario;
        return pasaEstado && pasaNombre && pasaUsuario;
    });

    renderizarSoloTabla(resultado);
}

/**
 * Renderizar tabla con un subconjunto sin tocar _todasLasTareas
 * @param {Array} tareas
 */
function renderizarSoloTabla(tareas) {
    const cuerpoTabla = document.getElementById('cuerpoTablaTareas');
    const tabla       = document.getElementById('tablaTareas');
    const mensaje     = document.getElementById('mensajeSinTareas');

    cuerpoTabla.innerHTML = '';

    if (tareas.length === 0) {
        tabla.classList.add('hidden');
        mensaje.classList.remove('hidden');
        return;
    }

    tabla.classList.remove('hidden');
    tabla.style.display = '';
    mensaje.classList.add('hidden');

    tareas.forEach(tarea => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${tarea.titulo}</td>
            <td>${tarea.descripcion}</td>
            <td>${tarea.estado}</td>
            <td>${new Date(tarea.fechaAsignacion).toLocaleDateString()}</td>
            <td>${tarea.usuarioNombre}</td>
            <td>
                <button class="boton-editar-asignada"
                    data-id="${tarea.id}"
                    data-titulo="${tarea.titulo}"
                    data-estado="${tarea.estado}">Editar</button>
                <button class="boton-eliminar"
                    data-id="${tarea.id}">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}


    //Conectar los 3 selectores de filtro y el botón limpia y Se exporta para llamarse desde tareas.ui.js

export function configurarFiltros() {
    ['filtroEstado', 'filtroNombre', 'filtroUsuario'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', aplicarFiltros);
    });

    const botonLimpiar = document.getElementById('botonLimpiarFiltros');
    if (botonLimpiar) {
        botonLimpiar.addEventListener('click', () => {
            ['filtroEstado', 'filtroNombre', 'filtroUsuario'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.selectedIndex = 0;
            });
            aplicarFiltros();
        });
    }
}
