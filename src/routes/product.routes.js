/**
 * Routes para Product
 */

const express = require('express');
const productController = require('../controllers/product.controller');
const { 
  createProductValidator,
  patchProductValidator,
  validateProductId,
  handleValidationErrors 
} = require('../validations/product.validation');

const router = express.Router();

/**
 * POST /products - Criar novo produto
 */
router.post(
  '/',
  createProductValidator,
  handleValidationErrors,
  productController.createProduct
);

/**
 * GET /products - Obter todos os produtos
 */
router.get('/', productController.getAllProducts);

/**
 * GET /products/:id - Obter produto específico
 */
router.get(
  '/:id',
  validateProductId,
  handleValidationErrors,
  productController.getProductById
);

/**
 * PUT /products/:id - Atualizar produto
 */
router.put(
  '/:id',
  validateProductId,
  createProductValidator,
  handleValidationErrors,
  productController.updateProduct
);

/**
 * PATCH /products/:id - Atualizar parcialmente um produto
 */
router.patch(
  '/:id',
  validateProductId,
  patchProductValidator,
  handleValidationErrors,
  productController.patchProduct
);

/**
 * DELETE /products/:id - Deletar produto
 */
router.delete(
  '/:id',
  validateProductId,
  handleValidationErrors,
  productController.deleteProduct
);

module.exports = router;
