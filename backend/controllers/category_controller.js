/**
 * @file category_controller.js
 * @brief Controlador HTTP para consultar las categorías disponibles.
 * @project Bibliotech
 */
const categoryRepository = require('../repositories/category_repository');

/** @class CategoryController @brief Expone el catálogo de categorías. */
class CategoryController
{
    /**
     * @brief Devuelve el catálogo de categorías en formato JSON.
     * @param {Object} req Petición HTTP.
     * @param {Object} res Respuesta HTTP.
     * @param {Function} next Delegación de errores al middleware global.
     */
    async getAll(req, res, next)
    {
        try
        {
            const categories = await categoryRepository.findAll();
            res.json(categories);
        }
        catch (error)
        {
            next(error);
        }
    }
}
module.exports = new CategoryController();
