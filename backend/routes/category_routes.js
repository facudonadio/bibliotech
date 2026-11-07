/**
 * @file category_routes.js
 * @brief Rutas autenticadas para consultar el catálogo de categorías.
 * @project Bibliotech
 */
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');
const { verifyToken } = require('../middleware/auth_middleware');

/** @brief Exige una sesión válida para consultar el catálogo de categorías. */
router.use(verifyToken);

/** @route GET /api/categories @brief Lista las categorías disponibles. */
router.get('/', categoryController.getAll);

module.exports = router;
