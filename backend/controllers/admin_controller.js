/**
 * @file admin_controller.js
 * @brief Controlador para la gestión y administración de usuarios del sistema.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const userRepository = require('../repositories/user_repository');
 const bookRepository = require('../repositories/book_repository');
 const fileHelper = require('../utils/file_helper/file_helper');
 const i18n = require('../utils/i18n/i18n'); // Inyección del gestor de idiomas
 const auditRepository = require('../repositories/audit_repository');
 
 /**
  * @class AdminController
  * @brief Agrupa la lógica de negocio para operaciones de alto privilegio (Administrador).
  */
 class AdminController 
 {
     /**
      * @brief Obtiene la lista completa de usuarios registrados y sus roles.
      * @param {Object} req - Petición HTTP.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores al Global Error Handler.
      */
     async getAllUsers(req, res, next)
     {
         try 
         {
             const users = await userRepository.findAll();
             res.json(users);
         }
         catch (error) 
         {
             next(error);
         }
     }
 
     /**
      * @brief Elimina un usuario del sistema y realiza una limpieza en cascada 
      * física de todos los documentos PDF asociados a él.
      * @param {Object} req - Petición HTTP (espera req.params.id y req.userId).
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores al Global Error Handler.
      */
     async deleteUser(req, res, next)
     {
         try 
         {
             const targetUserId = req.params.id;
             const adminId = req.userId; 
 
             // Regla de Negocio Semántica: Evitar auto-eliminación
             if (Number(targetUserId) === Number(adminId)) 
             {
                 const message = i18n.getMessage('CT_ADMIN_CANT_DELETE_SELF');
                 return res.status(403).json({ message });
             }
 
             // Obtener todos los libros cargados por el usuario objetivo antes de borrarlo
             const userBooks = await bookRepository.findByUserId(targetUserId);
             
             // El borrado y su evento de auditoría se confirman en una única transacción.
             const success = await auditRepository.withTransaction(async connection =>
             {
                 const deleted = await userRepository.delete(targetUserId, connection);

                 if (deleted)
                 {
                     await auditRepository.create({
                         user_id: adminId,
                         action: 'DELETE_USER',
                         target: String(targetUserId),
                         ip_address: req.ip || null
                     }, connection);
                 }

                 return deleted;
             });

             if (!success)
             {
                 const message = i18n.getMessage('CT_ADMIN_USER_NOT_FOUND');
                 return res.status(404).json({ message });
             }

             // La transacción SQL ya fue confirmada; contar por separado la limpieza física.
             let deletedFiles = 0;
             let failedFiles = 0;

             userBooks.forEach(book =>
             {
                 if (fileHelper.deleteFile(book.file_path))
                 {
                     deletedFiles++;
                 }
                 else
                 {
                     failedFiles++;
                 }
             });

             // Informar cantidades reales, sin confundir libros encontrados con archivos eliminados.
             const message = i18n.getMessage('CT_ADMIN_USER_DELETED')
                 .replace('%s', deletedFiles)
                 .replace('%s', failedFiles);

             res.json({ message, deletedFiles, failedFiles });
         } 
         catch (error) 
         {
             next(error);
         }
     }
 
     /**
      * @brief Obtiene todos los libros para que el administrador pueda gestionarlos.
      * @param {Object} req - Petición HTTP autenticada como administrador.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Delegación de errores.
      */
     async getAllBooks(req, res, next)
     {
         try
         {
             const books = await bookRepository.findAll();
             res.json(books);
         }
         catch (error)
         {
             next(error);
         }
     }
 }
 
 module.exports = new AdminController();