// backend/src/repositories/bookRepository.js
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/books.json');

class BookRepository {
  async ensureDataFile() {
    try {
      await fs.access(DATA_FILE);
    } catch {
      const dir = path.dirname(DATA_FILE);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
  }

  async findAll() {
    await this.ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  }

  async findById(id) {
    const books = await this.findAll();
    return books.find(book => book.id === id);
  }

  async create(bookData) {
    const books = await this.findAll();
    const newBook = {
      id: Date.now().toString(),
      ...bookData,
      available: true,
      createdAt: new Date().toISOString()
    };
    books.push(newBook);
    await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2));
    return newBook;
  }

  async update(id, bookData) {
    const books = await this.findAll();
    const index = books.findIndex(book => book.id === id);
    
    if (index === -1) return null;
    
    books[index] = {
      ...books[index],
      ...bookData,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2));
    return books[index];
  }

  async delete(id) {
    const books = await this.findAll();
    const filteredBooks = books.filter(book => book.id !== id);
    
    if (books.length === filteredBooks.length) return false;
    
    await fs.writeFile(DATA_FILE, JSON.stringify(filteredBooks, null, 2));
    return true;
  }
}

module.exports = new BookRepository();