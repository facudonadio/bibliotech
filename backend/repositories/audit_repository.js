/**
 * @file audit_repository.js
 * @brief Repositorio de persistencia para eventos de auditoría.
 * @project Bibliotech
 * @details Centraliza el registro histórico y las transacciones que vinculan
 *          una eliminación crítica con su correspondiente evento de auditoría.
 */

const db = require('../config/db');

/**
 * @class AuditRepository
 * @brief Persiste eventos críticos mediante Stored Procedures.
 */
class AuditRepository
{
    /**
     * @brief Ejecuta una operación y su auditoría dentro de una única transacción.
     * @param {Function} operation Operación asíncrona que recibe la conexión transaccional.
     * @returns {Promise<*>} Resultado devuelto por la operación.
     * @throws {Error} Propaga el error luego de intentar revertir la transacción.
     * @details La conexión dedicada evita que el borrado y el INSERT de auditoría
     *          se ejecuten en conexiones distintas del pool.
     */
    async withTransaction(operation)
    {
        const connection = await db.getConnection();

        try
        {
            await connection.beginTransaction();
            const result = await operation(connection);
            await connection.commit();
            return result;
        }
        catch (error)
        {
            try
            {
                await connection.rollback();
            }
            catch (rollbackError)
            {
                error.rollbackError = rollbackError;
            }

            throw error;
        }
        finally
        {
            connection.release();
        }
    }

    /**
     * @brief Persiste un evento de auditoría mediante el procedimiento almacenado.
     * @param {Object} eventData Datos del evento de auditoría.
     * @param {number} eventData.user_id Usuario autenticado que realizó la acción.
     * @param {string} eventData.action Código estable de la acción.
     * @param {string} eventData.target Identificador del recurso afectado.
     * @param {string|null} eventData.ip_address IP disponible en la petición.
     * @param {Object} executor Conexión transaccional o pool utilizado para ejecutar el SP.
     * @returns {Promise<void>} Se resuelve cuando la inserción queda ejecutada.
     */
    async create(eventData, executor = db)
    {
        const { user_id, action, target, ip_address } = eventData;

        await executor.execute(
            'CALL sp_create_audit_log(?, ?, ?, ?)',
            [user_id, action, target, ip_address]
        );
    }
}

module.exports = new AuditRepository();
