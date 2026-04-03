/**
 * Configuração da aplicação Express
 */

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./docs/swagger');
const productRoutes = require('./routes/product.routes');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL encoded
app.use(express.urlencoded({ extended: true }));

// Documentação Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Rotas de produtos
app.use('/api/products', productRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bem-vindo à API de Cadastro de Produtos',
    version: '1.0.0',
    documentation: 'http://localhost:5000/api/docs'
  });
});

// Middleware para tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

module.exports = app;
