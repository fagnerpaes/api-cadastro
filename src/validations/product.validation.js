/**
 * Validações para Product usando express-validator
 */

const { body, param, validationResult } = require('express-validator');

/**
 * Middleware para validar criação/atualização de produto
 */
const createProductValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must have at least 3 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than or equal to 0.01'),
  
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 0 }).withMessage('Quantity cannot be negative'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isLength({ min: 1 }).withMessage('Category cannot be empty')
];

/**
 * Middleware para validar atualização parcial de produto (PATCH)
 * Todos os campos são opcionais, mas se enviados devem ser validados
 */
const patchProductValidator = [
  body('name')
    .optional()
    .isLength({ min: 3 }).withMessage('Name must have at least 3 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than or equal to 0.01'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity cannot be negative'),
  
  body('category')
    .optional()
    .isLength({ min: 1 }).withMessage('Category cannot be empty')
];

/**
 * Middleware para validar ID na URL
 */
const validateProductId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Product ID must be a valid positive integer')
];

/**
 * Middleware para capturar erros de validação
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: formattedErrors
    });
  }
  
  next();
};

module.exports = {
  createProductValidator,
  patchProductValidator,
  validateProductId,
  handleValidationErrors
};
