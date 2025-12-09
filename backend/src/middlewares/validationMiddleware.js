// backend/src/middlewares/validationMiddleware.js

const validateBook = (req, res, next) => {
  const { title, author, year, genre, price } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      error: 'Título é obrigatório' 
    });
  }
  
  if (!author || author.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      error: 'Autor é obrigatório' 
    });
  }
  
  if (!year || isNaN(year)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Ano deve ser um número válido' 
    });
  }
  
  if (!genre || genre.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      error: 'Gênero é obrigatório' 
    });
  }
  
  if (!price || isNaN(price) || price <= 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Preço deve ser um número positivo' 
    });
  }
  
  next();
};

const validateRental = (req, res, next) => {
  const { customerName, customerEmail, books } = req.body;
  
  if (!customerName || customerName.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      error: 'Nome do cliente é obrigatório' 
    });
  }
  
  if (!customerEmail || !customerEmail.includes('@')) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email válido é obrigatório' 
    });
  }
  
  if (!books || !Array.isArray(books) || books.length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Deve selecionar pelo menos um livro' 
    });
  }
  
  next();
};

module.exports = { validateBook, validateRental };