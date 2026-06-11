// ============================================
// MÓDULO DE PROCESAMIENTO DE DATOS (RF04)
// ============================================

/**
 * Transforma un array de objetos en un archivo JSON descargable en el navegador.
 * * @param {Array} datos - Las tareas u objetos a exportar.
 * @param {string} nombreArchivo - El nombre que tendrá el archivo descargable.
 */
export function exportarAJsonDescargable(datos, nombreArchivo = 'tareas-exportadas.json') {
    if (!datos || datos.length === 0) {
        throw new Error('No hay datos disponibles para exportar.');
    }

    // 1. Convertir el objeto JS a una cadena de texto JSON formateada
    const jsonString = JSON.stringify(datos, null, 2);

    // 2. Crear un Blob (Binary Large Object) con el tipo de contenido adecuado
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 3. Crear un enlace temporal en el DOM para forzar la descarga
    const enlaceTemporal = document.createElement('a');
    enlaceTemporal.href = URL.createObjectURL(blob);
    enlaceTemporal.download = nombreArchivo;

    // 4. Simular el clic de descarga y remover el elemento inmediatamente
    enlaceTemporal.click();
    URL.revokeObjectURL(enlaceTemporal.href);
}