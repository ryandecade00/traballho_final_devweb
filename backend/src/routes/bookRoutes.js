// backend/src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validateBook } = require('../middlewares/validationMiddleware');

// GET /api/books - Listar todos os livros (com busca opcional)
router.get('/', bookController.getAll);

// GET /api/books/:id - Buscar livro por ID
router.get('/:id', bookController.getById);

// POST /api/books - Criar novo livro
router.post('/', validateBook, bookController.create);

// PUT /api/books/:id - Atualizar livro
router.put('/:id', validateBook, bookController.update);

// DELETE /api/books/:id - Deletar livro
router.delete('/:id', bookController.delete);

module.exports = router;