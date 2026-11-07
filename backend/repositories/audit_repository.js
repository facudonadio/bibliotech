/**
 * @file audit_repository.js
 * @brief Repositorio de persistencia para eventos de auditoría.
 * @project Bibliotech
 * @details Centraliza el acceso al registro histórico y evita SQL inline en controladores.
 */

const db = require('../config/db');

/**
 * @class AuditRepository
 * @brief Persiste eventos críticos mediante Stored Procedures.
 */
class AuditRepository
{
    /**
     * @brief Persiste un evento de auditoría y devuelve una promesa para esperar el resultado.
     * @param {Object} eventData Datos del evento de auditoría.
     * @param {number} eventData.user_id Usuario autenticado que realizó la acción.
     * @param {string} eventData.action Código estable de la acción.
     * @param {string} eventData.target Identificador del recurso afectado.
     * @param {string|null} eventData.ip_address IP disponible en la petición.
     * @returns {Promise<void>} Promesa que se resuelve cuando el SP confirma la inserción.
     * @note El controlador espera esta promesa antes de continuar con la limpieza física.
     *       Si el registro falla, captura el error y continúa con la eliminación.
     */
    async create(eventData)
    {
        const { user_id, action, target, ip_address } = eventData;

        await db.execute(
            'CALL sp_create_audit_log(?, ?, ?, ?)',
            [user_id, action, target, ip_address]
        );
    }
}

module.exports = new AuditRepository();
