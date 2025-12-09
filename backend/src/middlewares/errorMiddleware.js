// backend/src/middlewares/errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  console.error('❌ Erro capturado:', err.message);
  
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';
  
  res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorMiddleware;