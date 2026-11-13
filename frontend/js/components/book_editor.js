/**
 * @file book_editor.js
 * @brief Fachada frontend para abrir el modal de edición de metadatos.
 * @project Bibliotech
 */

/**
 * @class BookEditor
 * @brief Delegates la apertura del formulario al componente de interfaz compartido.
 */
const bookEditor =
{
    /**
     * @brief Abre el modal de edición construido por ui_handlers.js.
     * @param {Object} book Libro cuyos metadatos se editarán.
     * @param {Array} categories Categorías disponibles obtenidas desde la API.
     * @param {Function} onSave Callback asíncrono que persiste los metadatos.
     */
    open(book, categories, onSave)
    {
        showBookEditorModal(book, categories, onSave);
    }
};
