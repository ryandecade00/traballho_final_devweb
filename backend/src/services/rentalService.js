// backend/src/services/rentalService.js
const rentalRepository = require('../repositories/rentalRepository');
const bookRepository = require('../repositories/bookRepository');

class RentalService {
  async createRental(rentalData) {
    const { books, customerName, customerEmail, days } = rentalData;

    // Validar se os livros existem
    const bookPromises = books.map(bookId => bookRepository.findById(bookId));
    const foundBooks = await Promise.all(bookPromises);

    const invalidBooks = foundBooks.filter(book => !book);
    if (invalidBooks.length > 0) {
      const error = new Error('Um ou mais livros não foram encontrados');
      error.status = 404;
      throw error;
    }

    // Calcular valor total
    const totalPrice = foundBooks.reduce((sum, book) => sum + book.price, 0);
    const rentalDays = days || 7;
    const total = totalPrice * rentalDays;

    // Criar aluguel
    const rental = await rentalRepository.create({
      customerName,
      customerEmail,
      books: foundBooks.map(book => ({
        id: book.id,
        title: book.title,
        price: book.price
      })),
      days: rentalDays,
      totalPrice: total,
      returnDate: this.calculateReturnDate(rentalDays)
    });

    return rental;
  }

  async getAllRentals() {
    return await rentalRepository.findAll();
  }

  async getRentalById(id) {
    const rental = await rentalRepository.findById(id);
    
    if (!rental) {
      const error = new Error('Aluguel não encontrado');
      error.status = 404;
      throw error;
    }
    
    return rental;
  }

  calculateReturnDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }
}

module.exports = new RentalService();