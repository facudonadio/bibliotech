/**
 * @file ui_handlers.js
 * @brief Componentes de interfaz gráfica dinámica construidos en memoria (Zero innerHTML).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @brief Construye y muestra una ventana de diálogo modal informativa.
 * @details Manipulación estricta del DOM: Al usar document.createElement() y textContent, 
 * blindamos la aplicación contra inyección de código (XSS). El texto se renderiza como 
 * dato puro, nunca como HTML ejecutable.
 * @param {string} title - Título del cuadro de diálogo.
 * @param {string} message - Mensaje o cuerpo de la alerta.
 */
 function showModal(title, message) 
 {
     let modal = document.getElementById('msgModal');
 
     // Patrón Singleton aplicado al DOM: Solo creamos los elementos si no existen previamente
     if (!modal) 
     {
         modal = document.createElement('div');
         modal.id = 'msgModal';
         modal.className = 'w3-modal';
 
         const content = document.createElement('div');
         content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
         content.style.maxWidth = '400px';
 
         const header = document.createElement('header');
         header.className = 'w3-container w3-border-bottom';
 
         const titleElem = document.createElement('h3');
         titleElem.id = 'modalTitle';
         header.appendChild(titleElem);
 
         const bodyDiv = document.createElement('div');
         bodyDiv.className = 'w3-container w3-padding';
 
         const msgElem = document.createElement('p');
         msgElem.id = 'modalBody';
         
         const btnClose = document.createElement('button');
         btnClose.className = 'w3-button w3-right w3-teal w3-margin-bottom'; 
         btnClose.textContent = 'Cerrar';
         
         // Asignación de eventos mediante Listeners (más limpio que usar el atributo onclick en HTML)
         btnClose.addEventListener('click', () => 
         {
             modal.style.display = 'none';
         });
 
         // Ensamblaje del árbol DOM: De adentro hacia afuera
         bodyDiv.appendChild(msgElem);
         bodyDiv.appendChild(btnClose);
         content.appendChild(header);
         content.appendChild(bodyDiv);
         modal.appendChild(content);
         document.body.appendChild(modal);
     }
 
     // Actualizamos el contenido dinámico reutilizando los nodos existentes
     document.getElementById('modalTitle').textContent = title;
     document.getElementById('modalBody').textContent = message;
     modal.style.display = 'block';
 }
 
 /**
  * @brief Muestra una ventana modal conteniendo un visor de PDF interactivo.
  * @param {string} title - Título del documento.
  * @param {string} pdfUrl - Ruta física del archivo en el servidor.
  */
 function showPdfModal(title, pdfUrl) 
 {
     let modal = document.getElementById('pdfModal');
 
     if (!modal) 
     {
         modal = document.createElement('div');
         modal.id = 'pdfModal';
         modal.className = 'w3-modal';
         modal.style.zIndex = '9999';
 
         const content = document.createElement('div');
         content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
         content.style.width = '85%';
         content.style.maxWidth = '950px';
 
         const header = document.createElement('header');
         header.className = 'w3-container w3-border-bottom w3-padding w3-display-container';
 
         const titleElem = document.createElement('h3');
         titleElem.id = 'pdfModalTitle';
         titleElem.className = 'w3-margin-0 w3-text-teal';
         header.appendChild(titleElem);
 
         // Botón de cerrar posicionado absolutamente. 
         // Zero-innerHTML: Usamos el carácter Unicode '×' nativo en textContent.
         const btnCloseHeader = document.createElement('span');
         btnCloseHeader.className = 'w3-button w3-display-topright w3-hover-red';
         btnCloseHeader.textContent = '×'; 
         btnCloseHeader.style.fontSize = '24px';
         btnCloseHeader.addEventListener('click', () => 
         {
             modal.style.display = 'none';
             const iframe = document.getElementById('pdfIframe');
             // Al vaciar el src, detenemos la descarga en segundo plano del PDF
             if (iframe) 
             {
                 iframe.src = '';
             }
         });
         header.appendChild(btnCloseHeader);
 
         const bodyDiv = document.createElement('div');
         bodyDiv.className = 'w3-container w3-padding-0';
 
         const iframe = document.createElement('iframe');
         iframe.id = 'pdfIframe';
         iframe.style.width = '100%';
         iframe.style.height = '75vh';
         iframe.style.border = 'none';
         
         bodyDiv.appendChild(iframe);
         content.appendChild(header);
         content.appendChild(bodyDiv);
         modal.appendChild(content);
         document.body.appendChild(modal);
     }
 
     document.getElementById('pdfModalTitle').textContent = title;
     document.getElementById('pdfIframe').src = pdfUrl;
     modal.style.display = 'block';
 }

/**
 * @brief Construye y muestra un formulario modal para editar metadatos documentales.
 * @details El modal se ensambla con nodos DOM y textContent para mantener la política
 *          Zero-innerHTML. No incorpora ni envía el archivo PDF.
 * @param {Object} book Libro cuyos metadatos se van a editar.
 * @param {Array} categories Categorías recuperadas desde la API.
 * @param {Function} onSave Callback asíncrono que persiste los nuevos metadatos.
 */
function showBookEditorModal(book, categories, onSave)
{
    const modal = document.createElement('div');
    modal.className = 'w3-modal';
    modal.style.display = 'block';
    modal.style.zIndex = '10000';

    const content = document.createElement('div');
    content.className = 'w3-modal-content w3-card-4 vault-card w3-padding';
    content.style.maxWidth = '520px';

    const heading = document.createElement('h3');
    heading.className = 'w3-text-teal';
    heading.textContent = 'Editar metadatos';
    content.appendChild(heading);

    const form = document.createElement('form');
    const fields = {};

    /**
     * @brief Crea un campo de texto o numérico y lo registra para su lectura posterior.
     * @param {string} name Clave del metadato asociado al campo.
     * @param {string} labelText Texto visible de la etiqueta.
     * @param {*} value Valor inicial del campo.
     * @param {string} type Tipo HTML del control.
     */
    const addField = (name, labelText, value, type = 'text') =>
    {
        const label = document.createElement('label');
        label.className = 'w3-margin-top w3-show';
        label.textContent = labelText;

        const input = document.createElement('input');
        input.className = 'w3-input w3-border w3-round w3-transparent w3-text-white';
        input.type = type;
        input.value = value;
        input.required = true;

        if (type === 'number')
        {
            input.min = '1';
            input.step = '1';
        }

        form.append(label, input);
        fields[name] = input;
    };

    addField('title', 'Título', book.title);
    addField('author', 'Autor', book.author);

    const categoryLabel = document.createElement('label');
    categoryLabel.className = 'w3-margin-top w3-show';
    categoryLabel.textContent = 'Categoría';

    const categorySelect = document.createElement('select');
    categorySelect.className = 'w3-select w3-border w3-round w3-black w3-text-white';
    categorySelect.required = true;

    categories.forEach(category =>
    {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    categorySelect.value = String(book.category_id);
    form.append(categoryLabel, categorySelect);
    fields.category_id = categorySelect;

    addField('pages', 'Páginas', book.pages, 'number');

    const actions = document.createElement('div');
    actions.className = 'w3-margin-top';

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.className = 'w3-button w3-teal w3-round w3-margin-right';
    saveButton.textContent = 'Guardar cambios';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'w3-button w3-dark-grey w3-round';
    cancelButton.textContent = 'Cancelar';
    cancelButton.addEventListener('click', () => modal.remove());

    actions.append(saveButton, cancelButton);
    form.appendChild(actions);
    content.appendChild(form);
    modal.appendChild(content);
    document.body.appendChild(modal);

    form.addEventListener('submit', async event =>
    {
        event.preventDefault();
        saveButton.disabled = true;

        try
        {
            await onSave({
                title: fields.title.value.trim(),
                author: fields.author.value.trim(),
                category_id: Number(fields.category_id.value),
                pages: Number(fields.pages.value)
            });
            modal.remove();
        }
        catch (error)
        {
            showModal('Error al actualizar', error.message);
            saveButton.disabled = false;
        }
    });
}
