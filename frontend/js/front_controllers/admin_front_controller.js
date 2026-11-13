/**
 * @file admin_front_controller.js
 * @brief Controlador frontend para la visualización y administración de usuarios del sistema.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

let adminBookCategories = [];

 document.addEventListener('DOMContentLoaded', async () =>
 {
     await loadAdminCategories();
     loadUsers();
     loadAdminBooks();
 });

 /**
  * @brief Solicita al servidor el listado de usuarios y delega la renderización.
  */
 async function loadUsers() 
 {
     try 
     {
         const users = await apiService.request('/admin/users', 'GET');
         renderUsersTable(users);
     } 
     catch (error) 
     {
         showModal('Acceso denegado', error.message);
         window.location.href = '/login';
     }
 }
 

 /**
  * @brief Carga las categorías disponibles para los formularios de edición.
  */
 async function loadAdminCategories()
 {
     try
     {
         adminBookCategories = await apiService.request('/categories', 'GET');
     }
     catch (error)
     {
         showModal('Error', 'No se pudieron cargar las categorías: ' + error.message);
     }
 }

 /**
  * @brief Obtiene todos los libros mediante el endpoint exclusivo de administración.
  */
 async function loadAdminBooks()
 {
     try
     {
         const books = await apiService.request('/admin/books', 'GET');
         renderAdminBooksTable(books);
     }
     catch (error)
     {
         showModal('Error', 'No se pudieron cargar los libros: ' + error.message);
     }
 }

 /**
  * @brief Renderiza los libros globales y agrega la acción de edición.
  * @param {Array} books - Libros devueltos por el backend.
  */
 function renderAdminBooksTable(books)
 {
     const tbody = document.getElementById('booksTableBody');
     tbody.replaceChildren();

     books.forEach(book =>
     {
         const row = document.createElement('tr');
         const values = [
             book.id, book.title, book.author, book.category,
             book.pages, book.owner_username
         ];

         values.forEach(value =>
         {
             const cell = document.createElement('td');
             cell.textContent = value;
             row.appendChild(cell);
         });

         const actions = document.createElement('td');
         const editButton = document.createElement('button');
         editButton.className = 'w3-button w3-blue w3-tiny w3-round';
         editButton.textContent = 'Editar';
         editButton.addEventListener('click', () =>
         {
             bookEditor.open(book, adminBookCategories, async metadata =>
             {
                 await apiService.request(`/books/${book.id}`, 'PUT', metadata);
                 showModal('Actualizado', 'Los metadatos se actualizaron correctamente.');
                 await loadAdminBooks();
             });
         });

         actions.appendChild(editButton);
         row.appendChild(actions);
         tbody.appendChild(row);
     });
 }

 /**
  * @brief Renderización segura de usuarios iterando sobre el array y creando nodos DOM.
  * @param {Array} users - Lista de objetos de usuario retornada por la API.
  */
 function renderUsersTable(users) 
 {
     const tbody = document.getElementById('usersTableBody');
     
     // replaceChildren() vacía el contenedor sin interpretar cadenas como marcado HTML.
     tbody.replaceChildren();
 
     users.forEach(u => 
     {
         const row = document.createElement('tr');
 
         const tdId = document.createElement('td');
         tdId.textContent = u.id;
 
         const tdUser = document.createElement('td');
         const boldUser = document.createElement('b');
         boldUser.textContent = u.username;
         tdUser.appendChild(boldUser);
 
         const tdRole = document.createElement('td');
         const spanRole = document.createElement('span');
         spanRole.className = u.role === 'admin' ? "w3-tag w3-teal" : "w3-tag w3-blue";
         spanRole.textContent = u.role;
         tdRole.appendChild(spanRole);
 
         const tdDate = document.createElement('td');
         tdDate.textContent = new Date(u.created_at).toLocaleDateString();
 
         const tdActions = document.createElement('td');
         const btnDelete = document.createElement('button');
         btnDelete.className = "w3-button w3-red w3-tiny";
         btnDelete.textContent = "Eliminar usuario y sus PDFs";
         btnDelete.addEventListener('click', () => 
         {
             deleteUser(u.id);
         });
         tdActions.appendChild(btnDelete);
 
         // Ensamblaje final de la fila
         row.append(tdId, tdUser, tdRole, tdDate, tdActions);
         tbody.appendChild(row);
     });
 }
 
 /**
  * @brief Solicita la eliminación de un usuario tras confirmación manual.
  * @param {number} id - Identificador del usuario.
  */
 async function deleteUser(id) 
 {
     if (!confirm('¿Estás seguro de eliminar a este usuario? Se borrarán todos sus PDFs permanentemente.')) 
     {
         return;
     }
 
     try 
     {
         await apiService.request(`/admin/users/${id}`, 'DELETE');
         showModal('Éxito', 'Usuario y archivos eliminados con éxito');
         loadUsers(); 
     } 
     catch (error) 
     {
         showModal('Error al eliminar usuario', error.message);
     }
 }