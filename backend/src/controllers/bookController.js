// backend/src/controllers/bookController.js
const bookService = require('../services/bookService');

class BookController {
  async getAll(req, res, next) {
    try {
      const { search } = req.query;
      const books = search 
        ? await bookService.searchBooks(search)
        : await bookService.getAllBooks();
      
      res.status(200).json({
        success: true,
        data: books,
        count: books.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const book = await bookService.getBookById(id);
      
      res.status(200).json({
        success: true,
        data: book
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const bookData = req.body;
      const newBook = await bookService.createBook(bookData);
      
      res.status(201).json({
        success: true,
        message: 'Livro criado com sucesso',
        data: newBook
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const bookData = req.body;
      const updatedBook = await bookService.updateBook(id, bookData);
      
      res.status(200).json({
        success: true,
        message: 'Livro atualizado com sucesso',
        data: updatedBook
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await bookService.deleteBook(id);
      
      res.status(200).json({
        success: true,
        message: 'Livro removido com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookController();