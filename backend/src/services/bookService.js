// backend/src/services/bookService.js
const bookRepository = require('../repositories/bookRepository');

class BookService {
  async getAllBooks() {
    const books = await bookRepository.findAll();
    return books;
  }

  async getBookById(id) {
    const book = await bookRepository.findById(id);
    
    if (!book) {
      const error = new Error('Livro não encontrado');
      error.status = 404;
      throw error;
    }
    
    return book;
  }

  async createBook(bookData) {
    // Validações de negócio
    if (bookData.year > new Date().getFullYear()) {
      const error = new Error('Ano não pode ser futuro');
      error.status = 400;
      throw error;
    }

    if (bookData.price < 0) {
      const error = new Error('Preço não pode ser negativo');
      error.status = 400;
      throw error;
    }

    const newBook = await bookRepository.create(bookData);
    return newBook;
  }

  async updateBook(id, bookData) {
    const existingBook = await bookRepository.findById(id);
    
    if (!existingBook) {
      const error = new Error('Livro não encontrado');
      error.status = 404;
      throw error;
    }

    // Validações de negócio
    if (bookData.year && bookData.year > new Date().getFullYear()) {
      const error = new Error('Ano não pode ser futuro');
      error.status = 400;
      throw error;
    }

    const updatedBook = await bookRepository.update(id, bookData);
    return updatedBook;
  }

  async deleteBook(id) {
    const existingBook = await bookRepository.findById(id);
    
    if (!existingBook) {
      const error = new Error('Livro não encontrado');
      error.status = 404;
      throw error;
    }

    const deleted = await bookRepository.delete(id);
    return deleted;
  }

  async searchBooks(query) {
    const books = await bookRepository.findAll();
    
    if (!query) return books;
    
    const lowerQuery = query.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.genre.toLowerCase().includes(lowerQuery)
    );
  }
}

module.exports = new BookService();