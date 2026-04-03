/**
 * Controller para Product
 * Responsável por lidar com requisições HTTP e retornar respostas
 */

const productService = require('../services/product.service');

/**
 * POST /products - Cria um novo produto
 */
const createProduct = (req, res) => {
  try {
    const { name, price, quantity, category } = req.body;
    
    const product = productService.createProduct({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

/**
 * GET /products - Retorna todos os produtos
 */
const getAllProducts = (req, res) => {
  try {
    const products = productService.getAllProducts();
    
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: error.message
    });
  }
};

/**
 * GET /products/:id - Retorna um produto específico
 */
const getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = productService.getProductById(id);
    
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error: error.message
    });
  }
};

/**
 * PUT /products/:id - Atualiza um produto existente
 */
const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, category } = req.body;
    
    const product = productService.updateProduct(id, {
      name,
      price: price !== undefined ? parseFloat(price) : undefined,
      quantity: quantity !== undefined ? parseInt(quantity) : undefined,
      category
    });
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: error.message
      });
    }
  }
};

/**
 * DELETE /products/:id - Deleta um produto
 */
const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    
    productService.deleteProduct(id);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
