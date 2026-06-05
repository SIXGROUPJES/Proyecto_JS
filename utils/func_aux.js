// ============================================
// RENDERIZAR TAREAS
// ============================================

/**
 * Mostrar tareas en tabla
 * 
 * @param {Array} tareas
 */
export function renderizarTareas(tareas) {

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

        tabla.style.display = 'table';

        return;

    }

    /*
        Mostrar tabla
    */
    tabla.classList.remove(
        'hidden'
    );

    mensaje.classList.add(
        'hidden'
    );

    mensaje.style.display = 'none';

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

                    await eliminarTarea(
                        id
                    );

                }
            );

        });

}
// ============================================
// FUNCIONES PARA EL DOM
// ============================================

/**
 * Crea elementos HTML dinámicamente.
 *
 * Esta función ayuda a reutilizar
 * código al manipular el DOM.
 *
 * @param {string} tipoElemento
 * @param {string} texto
 * @returns {HTMLElement}
 */
export function crearElemento(
    tipoElemento,
    texto = ''
) {

    const elemento =
        document.createElement(tipoElemento);

    elemento.textContent = texto;

    return elemento;

}

// ============================================
// FUNCIONES DE FORMULARIOS
// ============================================

/**
 * Limpia un formulario completo.
 *
 * @param {HTMLFormElement} formulario
 */
export function limpiarFormulario(formulario) {

    formulario.reset();

}

/**
 * Reinicia el contador
 * de caracteres.
 */
export function reiniciarContadorCaracteres() {

    document.getElementById(
        'contadorCaracteres'
    ).textContent = '0';

}
// ============================================
// FUNCIONES VISUALES
// ============================================

/**
 * Retorna una clase CSS dependiendo
 * del estado de la tarea.
 *
 * Esto permitirá aplicar colores
 * diferentes en CSS.
 *
 * @param {string} estado
 * @returns {string}
 */
export function obtenerClaseEstado(estado) {

    /*
        Convertimos el texto a minúsculas
        para evitar errores.
    */
    const estadoMinuscula =
        estado.toLowerCase();

    /*
        Dependiendo del estado,
        retornamos una clase CSS.
    */
    switch (estadoMinuscula) {

        case 'pendiente':

            return 'estado-pendiente';

        case 'en progreso':

            return 'estado-progreso';

        case 'completada':

            return 'estado-completada';

        default:

            return '';

    }

}

// ============================================
// FUNCIONES ADICIONALES (BONUS)
// ============================================

/**
 * Genera las iniciales
 * de un nombre.
 *
 * Ejemplo:
 * Juan Pérez -> JP
 *
 * @param {string} nombreCompleto
 * @returns {string}
 */
export function obtenerIniciales(nombreCompleto) {

    /*
        Dividimos el nombre
        en palabras.
    */
    const palabras =
        nombreCompleto.trim().split(' ');

    /*
        Si solo existe un nombre,
        tomamos las primeras 2 letras.
    */
    if (palabras.length === 1) {

        return palabras[0]
            .substring(0, 2)
            .toUpperCase();

    }

    /*
        Tomamos la primera letra
        de cada palabra.
    */
    return palabras
        .map(palabra => palabra[0])
        .join('')
        .toUpperCase();

}

/**
 * Guarda datos en localStorage.
 *
 * @param {string} clave
 * @param {Array|Object} datos
 */
export function guardarEnLocalStorage(
    clave,
    datos
) {

    localStorage.setItem(
        clave,
        JSON.stringify(datos)
    );

}

/**
 * Obtiene datos desde localStorage.
 *
 * @param {string} clave
 * @returns {Array|Object|null}
 */
export function obtenerDeLocalStorage(clave) {

    const datos =
        localStorage.getItem(clave);

    /*
        Si no existen datos,
        retornamos null.
    */
    if (!datos) {

        return null;

    }

    /*
        Convertimos nuevamente
        a objeto JavaScript.
    */
    return JSON.parse(datos);

}
