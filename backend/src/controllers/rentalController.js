// backend/src/controllers/rentalController.js
const rentalService = require('../services/rentalService');

class RentalController {
  async create(req, res, next) {
    try {
      const rentalData = req.body;
      const rental = await rentalService.createRental(rentalData);
      
      res.status(201).json({
        success: true,
        message: 'Aluguel realizado com sucesso',
        data: rental
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const rentals = await rentalService.getAllRentals();
      
      res.status(200).json({
        success: true,
        data: rentals,
        count: rentals.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const rental = await rentalService.getRentalById(id);
      
      res.status(200).json({
        success: true,
        data: rental
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RentalController();