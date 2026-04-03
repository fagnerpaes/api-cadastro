/**
 * Service para Product
 * Contém a lógica de negócio relacionada aos produtos
 */

const productRepository = require('../data/memory.repository');

/**
 * Cria um novo produto
 * @param {Object} productData - Dados do produto (name, price, quantity, category)
 * @returns {Object} Produto criado com ID gerado
 */
const createProduct = (productData) => {
  return productRepository.create(productData);
};

/**
 * Obtém todos os produtos
 * @returns {Array} Array com todos os produtos
 */
const getAllProducts = () => {
  return productRepository.findAll();
};

/**
 * Obtém um produto específico pelo ID
 * @param {number} id - ID do produto
 * @returns {Object|null} Produto encontrado ou null
 */
const getProductById = (id) => {
  const product = productRepository.findById(id);
  
  if (!product) {
    throw new Error(`Product with ID ${id} not found`);
  }
  
  return product;
};

/**
 * Atualiza um produto existente
 * @param {number} id - ID do produto a atualizar
 * @param {Object} productData - Dados a atualizar (name, price, quantity, category)
 * @returns {Object} Produto atualizado
 */
const updateProduct = (id, productData) => {
  const product = productRepository.findById(id);
  
  if (!product) {
    throw new Error(`Product with ID ${id} not found`);
  }
  
  return productRepository.update(id, productData);
};

/**
 * Deleta um produto
 * @param {number} id - ID do produto a deletar
 * @returns {boolean} true se deletado
 */
const deleteProduct = (id) => {
  const product = productRepository.findById(id);
  
  if (!product) {
    throw new Error(`Product with ID ${id} not found`);
  }
  
  return productRepository.deleteById(id);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
