/**
 * @file category_repository.js
 * @brief Acceso al catálogo de categorías mediante procedimientos almacenados.
 * @project Bibliotech
 */

const db = require('../config/db');

/** @class CategoryRepository @brief Consulta las categorías disponibles. */
class CategoryRepository
{
    /**
     * @brief Obtiene todas las categorías ordenadas según el catálogo.
     * @returns {Promise<Array>} Identificadores y nombres de categorías.
     */
    async findAll()
    {
        const [rows] = await db.execute('CALL sp_get_all_categories()');
        return rows[0];
    }
}

module.exports = new CategoryRepository();
