/**
 * @file book_editor.js
 * @brief Componente reutilizable para editar metadatos de libros sin enviar archivos.
 * @project Bibliotech
 */

/**
 * @brief Abre un formulario modal con los metadatos actuales del libro.
 * @param {Object} book - Libro que se desea editar.
 * @param {Array} categories - Categorías disponibles obtenidas desde la API.
 * @param {Function} onSave - Función asíncrona que persiste los metadatos.
 */
const bookEditor =
{
    open(book, categories, onSave)
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
};
