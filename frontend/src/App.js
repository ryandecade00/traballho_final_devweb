import React, { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'http://localhost:3000/api';

function App() {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [customerData, setCustomerData] = useState({ name: '', email: '', days: 7 });
  
  const [bookForm, setBookForm] = useState({
    title: '', author: '', year: '', genre: '', price: '', description: '', cover: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/books`);
      const data = await response.json();
      setBooks(data.data || []);
    } catch (error) {
      showMessage('Erro ao carregar livros', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const addToCart = (book) => {
    if (!cart.find(b => b.id === book.id)) {
      setCart([...cart, book]);
      showMessage('Livro adicionado ao carrinho!', 'success');
    } else {
      showMessage('Livro já está no carrinho', 'info');
    }
  };

  const removeFromCart = (bookId) => {
    setCart(cart.filter(b => b.id !== bookId));
    showMessage('Livro removido do carrinho', 'success');
  };

  const calculateTotal = () => {
    return cart.reduce((sum, book) => sum + book.price, 0) * customerData.days;
  };

  const handleRental = async () => {
    if (!customerData.name || !customerData.email) {
      showMessage('Preencha todos os dados do cliente', 'error');
      return;
    }
    if (cart.length === 0) {
      showMessage('Adicione livros ao carrinho', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/rentals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerData.name,
          customerEmail: customerData.email,
          books: cart.map(b => b.id),
          days: customerData.days
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('Aluguel realizado com sucesso!', 'success');
        setView('success');
        setCart([]);
        setCustomerData({ name: '', email: '', days: 7 });
      } else {
        showMessage(data.error || 'Erro ao realizar aluguel', 'error');
      }
    } catch (error) {
      showMessage('Erro ao processar aluguel', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    
    const bookData = {
      ...bookForm,
      year: parseInt(bookForm.year),
      price: parseFloat(bookForm.price)
    };

    try {
      setLoading(true);
      const url = editingId ? `${API_URL}/books/${editingId}` : `${API_URL}/books`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage(data.message, 'success');
        fetchBooks();
        resetForm();
      } else {
        showMessage(data.error || 'Erro ao salvar livro', 'error');
      }
    } catch (error) {
      showMessage('Erro ao salvar livro', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setBookForm({
      title: book.title,
      author: book.author,
      year: book.year.toString(),
      genre: book.genre,
      price: book.price.toString(),
      description: book.description || '',
      cover: book.cover || ''
    });
    setEditingId(book.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este livro?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' });
      const data = await response.json();
      
      if (data.success) {
        showMessage('Livro excluído com sucesso', 'success');
        fetchBooks();
      } else {
        showMessage(data.error || 'Erro ao excluir livro', 'error');
      }
    } catch (error) {
      showMessage('Erro ao excluir livro', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBookForm({ title: '', author: '', year: '', genre: '', price: '', description: '', cover: '' });
    setEditingId(null);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <h1>📚 Biblioteca Express</h1>
          <nav className="nav">
            <button 
              onClick={() => setView('catalog')} 
              className={`btn btn-nav ${view === 'catalog' ? 'active' : ''}`}
            >
              Catálogo
            </button>
            <button 
              onClick={() => setView('cart')} 
              className={`btn btn-nav ${view === 'cart' ? 'active' : ''}`}
              style={{position: 'relative'}}
            >
              Carrinho
              {cart.length > 0 && <span className="badge">{cart.length}</span>}
            </button>
            <button 
              onClick={() => setView('admin')} 
              className={`btn btn-nav ${view === 'admin' ? 'active' : ''}`}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <main className="main container">
        {view === 'catalog' && (
          <div>
            <input 
              type="text" 
              placeholder="Buscar livros por título ou autor..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="search-input"
            />

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <div className="grid">
                {filteredBooks.map(book => (
                  <div key={book.id} className="card">
                    <div className="card-image">
                      {book.cover ? <img src={book.cover} alt={book.title} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span>📖</span>}
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{book.title}</h3>
                      <p className="card-text">✍️ {book.author}</p>
                      <p className="card-text">{book.genre} • {book.year}</p>
                      {book.description && <p className="card-text">{book.description}</p>}
                      <div className="card-footer">
                        <span className="card-price">R$ {book.price.toFixed(2)}/dia</span>
                        <button onClick={() => addToCart(book)} className="btn btn-primary">
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredBooks.length === 0 && (
              <div className="empty-state">
                <p>Nenhum livro encontrado</p>
              </div>
            )}
          </div>
        )}

        {view === 'cart' && (
          <div className="cart-container">
            <h2 className="cart-title">Seu Carrinho</h2>
            
            {cart.length === 0 ? (
              <div className="white-box espaco" style={{textAlign:'center'}}>
                <p className="empty-state">Carrinho vazio</p>
                <button onClick={() => setView('catalog')} className="btn btn-primary">
                  Ver Catálogo
                </button>
              </div>
            ) : (
              <div>
                <div className="white-box">
                  {cart.map(book => (
                    <div key={book.id} className="cart-item">
                      <div>
                        <h3 style={{fontWeight:'bold',fontSize:'1.125rem'}}>{book.title}</h3>
                        <p className="card-text">{book.author}</p>
                        <p style={{color:'#0f791d',fontWeight:'600'}}>R$ {book.price.toFixed(2)}/dia</p>
                      </div>
                      <button onClick={() => removeFromCart(book.id)} className="btn btn-danger">
                        Remover
                      </button>
                    </div>
                  ))}
                </div>

                <div className="white-box">
                  <h3 className="section-title">Dados do Cliente</h3>
                  <div className="form-group">
                    <input 
                      type="text" 
                      placeholder="Nome completo" 
                      value={customerData.name} 
                      onChange={(e) => setCustomerData({...customerData, name: e.target.value})} 
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={customerData.email} 
                      onChange={(e) => setCustomerData({...customerData, email: e.target.value})} 
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dias de aluguel:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="30" 
                      value={customerData.days} 
                      onChange={(e) => setCustomerData({...customerData, days: parseInt(e.target.value) || 1})} 
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="total-box">
                  <div className="total-header">
                    <span style={{fontSize:'1.25rem'}}>Total:</span>
                    <span className="total-amount">R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleRental} 
                    disabled={loading} 
                    className="btn btn-success"
                    style={{width:'100%',padding:'0.75rem',fontSize:'1.125rem'}}
                  >
                    {loading ? 'Processando...' : 'Finalizar Aluguel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'success' && (
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h2 className="success-title">Aluguel Confirmado!</h2>
            <p className="success-text">Seu pedido foi realizado com sucesso. Você receberá um email de confirmação.</p>
            <button onClick={() => setView('catalog')} className="btn btn-primary" style={{padding:'0.75rem 2rem',fontSize:'1.125rem'}}>
              Voltar ao Catálogo
            </button>
          </div>
        )}

        {view === 'admin' && (
          <div className="admin-container">
            <h2 className="admin-title">Administração</h2>
            
            <div className="white-box">
              <h3 className="section-title">{editingId ? 'Editar Livro' : 'Adicionar Novo Livro'}</h3>
              <form onSubmit={handleBookSubmit}>
                <div className="form-grid">
                  <input 
                    type="text" 
                    placeholder="Título" 
                    value={bookForm.title} 
                    onChange={(e) => setBookForm({...bookForm, title: e.target.value})} 
                    className="form-input" 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Autor" 
                    value={bookForm.author} 
                    onChange={(e) => setBookForm({...bookForm, author: e.target.value})} 
                    className="form-input" 
                    required 
                  />
                  <input 
                    type="number" 
                    placeholder="Ano" 
                    value={bookForm.year} 
                    onChange={(e) => setBookForm({...bookForm, year: e.target.value})} 
                    className="form-input" 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Gênero" 
                    value={bookForm.genre} 
                    onChange={(e) => setBookForm({...bookForm, genre: e.target.value})} 
                    className="form-input" 
                    required 
                  />
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="Preço por dia" 
                    value={bookForm.price} 
                    onChange={(e) => setBookForm({...bookForm, price: e.target.value})} 
                    className="form-input" 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="URL da Capa (opcional)" 
                    value={bookForm.cover} 
                    onChange={(e) => setBookForm({...bookForm, cover: e.target.value})} 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    placeholder="Descrição" 
                    value={bookForm.description} 
                    onChange={(e) => setBookForm({...bookForm, description: e.target.value})} 
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{flex:1}}>
                    {editingId ? 'Atualizar' : 'Adicionar'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="btn btn-secondary">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="white-box">
              <h3 className="section-title">Livros Cadastrados ({books.length})</h3>
              <div>
                {books.map(book => (
                  <div key={book.id} className="book-list-item">
                    <div>
                      <h4 style={{fontWeight:'bold',fontSize:'1.125rem'}}>{book.title}</h4>
                      <p className="card-text">{book.author} • {book.year} • {book.genre}</p>
                      <p style={{color:'#0f791d',fontWeight:'600'}}>R$ {book.price.toFixed(2)}/dia</p>
                    </div>
                    <div className="book-actions">
                      <button onClick={() => handleEdit(book)} className="btn btn-primary">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(book.id)} className="btn btn-danger">
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Biblioteca Express © 2024 - Trabalho de Desenvolvimento Web</p>
      </footer>
    </div>
  );
}

export default App;