
import { renderizarTareas } from '../utils/func_aux.js';
import {
    obtenerTareasDisponibles,
    actualizarTareaDisponible,
    eliminarTareaDisponible
} from '../services/tareasDisponibles.service.js';
import {
    obtenerTareasAsignadasPorUsuario,
    crearTareaAsignada,
    eliminarTareasAsignadasPorUsuario
} from '../services/tareasAsignadas.service.js';

let usuarioActual = null;

// ============================================
// MOSTRAR DATOS USUARIO
// ============================================

/**
 * Mostrar datos del usuario
 * 
 * @param {Object} usuario
 */
export function mostrarDatosUsuario(usuario) {

    /*
        Guardar usuario actual
    */
    usuarioActual = usuario;

    /*
        Mostrar datos
    */
    document.getElementById(
        'nombreUsuario'
    ).textContent = usuario.name;

    document.getElementById(
        'correoUsuario'
    ).textContent = usuario.email;

    /*
        Mostrar secciones
    */
    document.getElementById(
        'seccionDatosUsuario'
    ).classList.remove('hidden');

    document.getElementById(
        'seccionFormularioTareas'
    ).classList.remove('hidden');

    document.getElementById(
        'botonLimpiarTareas'
    ).classList.remove('hidden');

    /*
        Cargar tareas disponibles
    */
    cargarTareasDisponibles();

    /*
        Cargar tareas usuario
    */
    cargarTareasUsuario(
        usuario.id
    );

}


// ============================================
// CARGAR TAREAS DISPONIBLES
// ============================================
export async function cargarTareasDisponibles() {
    try {
        const tareas = await obtenerTareasDisponibles();

        const lista = document.getElementById('listaTareasDisponibles');
        lista.innerHTML = '';

        const selector = document.getElementById('selectorTareas');
        selector.innerHTML = '<option value="">-- Selecciona una tarea --</option>';

        tareas.forEach(tarea => {
            const opcion = document.createElement('option');
            opcion.value = tarea.id;
            opcion.textContent = tarea.titulo;
            selector.appendChild(opcion);

            const fila = document.createElement('div');
            fila.classList.add('dropdown-item');

            fila.innerHTML = `
                <span class="dropdown-item-titulo">${tarea.titulo}</span>
                <span class="dropdown-item-acciones">
                    <span class="accion-editar"   data-id="${tarea.id}">Editar ✏️</span>
                    <span class="accion-eliminar" data-id="${tarea.id}">Eliminar 🗑️</span>
                </span>
            `;

            // Seleccionar tarea al hacer clic en el título
            fila.querySelector('.dropdown-item-titulo').addEventListener('click', function () {
                document.getElementById('selectorTareas').value = tarea.id;
                document.getElementById('dropdownTexto').textContent = tarea.titulo;
                document.getElementById('listaTareasDisponibles').classList.remove('abierto');
            });

            // Editar
            fila.querySelector('.accion-editar').addEventListener('click', async function (e) {
                e.stopPropagation();
                const id = this.dataset.id;
                const nuevoTitulo = prompt('Ingrese el nuevo nombre de la tarea:');
                if (!nuevoTitulo) return;
                await actualizarTareaDisponible(id, { titulo: nuevoTitulo });
                if (document.getElementById('selectorTareas').value === id) {
                    document.getElementById('dropdownTexto').textContent = nuevoTitulo;
                }
                await cargarTareasDisponibles();
            });

            // Eliminar
            fila.querySelector('.accion-eliminar').addEventListener('click', async function (e) {
                e.stopPropagation();
                const id = this.dataset.id;
                const confirmar = confirm('¿Deseas eliminar esta tarea disponible?');
                if (!confirmar) return;
                await eliminarTareaDisponible(id);
                if (document.getElementById('selectorTareas').value === id) {
                    document.getElementById('selectorTareas').value = '';
                    document.getElementById('dropdownTexto').textContent = '-- Selecciona una tarea --';
                }
                await cargarTareasDisponibles();
            });

            lista.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
}



// ============================================
// CARGAR TAREAS USUARIO
// ============================================

/**
 * Cargar tareas asignadas
 * 
 * @param {number} usuarioId
 */
export async function cargarTareasUsuario(usuarioId) {

    try {

        /*
            Petición
        */
        /*
            Convertir respuesta
        */
        const tareas =
            await obtenerTareasAsignadasPorUsuario(usuarioId);

        console.log(
            'Tareas encontradas:',
            tareas
        );

        /*
            Renderizar tabla
        */
        renderizarTareas(
            tareas,
            () => cargarTareasUsuario(usuarioId)
        );

    } catch (error) {

        console.error(
            'Error:',
            error
        );

    }

}

// ============================================
// REGISTRAR TAREA
// ============================================

/**
 * Asignar tarea
 * 
 * @param {Object} datosTarea
 */
export async function registrarTarea(datosTarea) {

    try {

        /*
            =====================================
            1. OBTENER TAREAS DISPONIBLES
            =====================================
        */
        /*
            Convertir respuesta JSON
        */
        const tareasDisponibles =
            await obtenerTareasDisponibles();

        /*
            =====================================
            2. BUSCAR LA TAREA SELECCIONADA
            =====================================
        */
        const tareaSeleccionada =
            tareasDisponibles.find(

                tarea =>

                    tarea.id ===
                    datosTarea.idTarea

            );

        if (!tareaSeleccionada) {

            throw new Error(
                'La tarea seleccionada no existe'
            );

        }


        /*
            =====================================
            3. CREAR REGISTRO DE ASIGNACIÓN
            =====================================

            NO estamos creando una tarea nueva.

            Solo estamos relacionando:
            - usuario
            - tarea existente
            - estado
        */
        const tareaAsignada = {

            usuarioId:
                usuarioActual.id,

            usuarioNombre:
                usuarioActual.name,

            tareaId:
                tareaSeleccionada.id,

            titulo:
                tareaSeleccionada.titulo,

            descripcion:
                tareaSeleccionada.descripcion,

            estado:
                datosTarea.estado,

            fechaAsignacion:
                new Date().toISOString()

        };

        console.log(
            'Enviando asignación:',
            tareaAsignada
        );

        /*
            =====================================
            4. GUARDAR ASIGNACIÓN
            =====================================
        */
        const respuesta =
            await crearTareaAsignada(
                tareaAsignada
            );

        /*
            Validar respuesta
        */
        if (!respuesta.ok) {

            throw new Error(
                'Error al asignar tarea'
            );

        }

        /*
            =====================================
            5. RECARGAR TABLA
            =====================================
        */
        await cargarTareasUsuario(
            usuarioActual.id
        );

    } catch (error) {

        console.error(
            'Error al registrar tarea:',
            error
        );

        alert(
            'Ocurrió un error al asignar la tarea'
        );

    }

}


// ============================================
// LIMPIAR TODAS LAS TAREAS
// ============================================

/**
 * Eliminar todas las tareas
 */
export async function limpiarTodasLasTareas() {

    try {

        /*
            Obtener tareas
        */
        await eliminarTareasAsignadasPorUsuario(
            usuarioActual.id
        );

        /*
            Recargar tabla
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
