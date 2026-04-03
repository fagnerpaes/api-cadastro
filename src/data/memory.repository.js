/**
 * Memory Repository for Products
 * Armazena dados em memória durante a execução
 */

let products = [];
let nextId = 1;

/**
 * Cria um novo produto em memória
 * @param {Object} product - Dados do produto
 * @returns {Object} Produto criado com ID gerado
 */
const create = (product) => {
  const newProduct = {
    id: nextId++,
    ...product
  };
  products.push(newProduct);
  return newProduct;
};

/**
 * Retorna todos os produtos
 * @returns {Array} Array de todos os produtos
 */
const findAll = () => {
  return [...products];
};

/**
 * Encontra um produto pelo ID
 * @param {number} id - ID do produto
 * @returns {Object|null} Produto encontrado ou null
 */
const findById = (id) => {
  return products.find(p => p.id === parseInt(id)) || null;
};

/**
 * Atualiza um produto existente
 * @param {number} id - ID do produto a atualizar
 * @param {Object} product - Novos dados do produto
 * @returns {Object|null} Produto atualizado ou null se não encontrado
 */
const update = (id, product) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;

  products[index] = { ...products[index], ...product };
  return products[index];
};

/**
 * Deleta um produto
 * @param {number} id - ID do produto a deletar
 * @returns {boolean} true se deletado, false se não encontrado
 */
const deleteById = (id) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index === -1) return false;

  products.splice(index, 1);
  return true;
};

/**
 * Limpa todos os produtos (útil para testes)
 */
const clear = () => {
  products = [];
  nextId = 1;
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  deleteById,
  clear
};
