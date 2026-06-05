
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
        const respuesta = await fetch(`${API_URL}/tareasDisponibles`);
        const tareas    = await respuesta.json();

        const lista = document.getElementById('dropdownLista');
        lista.innerHTML = '';

        tareas.forEach(tarea => {
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
                document.getElementById('dropdownLista').classList.remove('abierto');
            });

            // Editar
            fila.querySelector('.accion-editar').addEventListener('click', async function (e) {
                e.stopPropagation();
                const id = this.dataset.id;
                const nuevoTitulo = prompt('Ingrese el nuevo nombre de la tarea:');
                if (!nuevoTitulo) return;
                await fetch(`${API_URL}/tareasDisponibles/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ titulo: nuevoTitulo })
                });
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
                await fetch(`${API_URL}/tareasDisponibles/${id}`, {
                    method: 'DELETE'
                });
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
        const respuesta =
            await fetch(
                `${API_URL}/tareasAsignadas?usuarioId=${usuarioId.toString()}`
            );

        /*
            Convertir respuesta
        */
        const tareas =
            await respuesta.json();

        console.log(
            'Tareas encontradas:',
            tareas
        );

        /*
            Renderizar tabla
        */
        renderizarTareas(
            tareas
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
        const respuestaTareas =
            await fetch(
                `${API_URL}/tareasDisponibles`
            );

        /*
            Convertir respuesta JSON
        */
        const tareasDisponibles =
            await respuestaTareas.json();

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
                new Date()

        };

        /*
            =====================================
            4. GUARDAR ASIGNACIÓN
            =====================================
        */
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
// ELIMINAR TAREA
// ============================================

/**
 * Eliminar tarea
 * 
 * @param {number} idTarea
 */
async function eliminarTarea(idTarea) {

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
        const respuesta =
            await fetch(
                `${API_URL}/tareasAsignadas?usuarioId=${usuarioActual.id}`
            );

        /*
            Convertir respuesta
        */
        const tareas =
            await respuesta.json();

        /*
            Eliminar una por una
        */
        for (const tarea of tareas) {

            await fetch(
                `${API_URL}/tareasAsignadas/${tarea.id}`,
                {
                    method: 'DELETE'
                }
            );

        }

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
