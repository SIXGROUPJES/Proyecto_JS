// ============================================
// UTILIDAD: EXPORTACIÓN A JSON
// ============================================
// Genera un archivo .json en el navegador y lo descarga:
// 1. Convierte los datos a texto JSON con formato legible.
// 2. Crea un Blob y una URL temporal.
// 3. Crea un enlace <a download> y simula el clic.
// 4. Libera la URL temporal.
export function exportarJson(nombreArchivo, datos) {
    const contenido = JSON.stringify(datos, null, 2);
    const blob = new Blob([contenido], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.click();

    URL.revokeObjectURL(url);
}
