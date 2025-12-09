// backend/src/routes/rentalRoutes.js
const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const { validateRental } = require('../middlewares/validationMiddleware');

// POST /api/rentals - Criar novo aluguel
router.post('/', validateRental, rentalController.create);

// GET /api/rentals - Listar todos os aluguéis
router.get('/', rentalController.getAll);

// GET /api/rentals/:id - Buscar aluguel por ID
router.get('/:id', rentalController.getById);

module.exports = router;