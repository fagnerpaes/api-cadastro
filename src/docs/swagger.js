/**
 * Configuração do Swagger/OpenAPI
 */

const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Cadastro de Produtos',
      version: '1.0.0',
      description: 'API REST para administração de produtos com armazenamento em memória'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'price', 'quantity', 'category'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do produto (gerado automaticamente)',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Nome do produto (mínimo 3 caracteres)',
              example: 'Notebook Dell',
              minLength: 3
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Preço do produto (mínimo 0.01)',
              example: 2499.99,
              minimum: 0.01
            },
            quantity: {
              type: 'integer',
              description: 'Quantidade em estoque (não pode ser negativa)',
              example: 10,
              minimum: 0
            },
            category: {
              type: 'string',
              description: 'Categoria do produto (não pode ser vazio)',
              example: 'Eletrônicos'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            error: {
              type: 'string'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Validation error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: []
};

const specs = swaggerJsDoc(options);

// Adicionando os endpoints manualmente
specs.paths = {
  '/products': {
    post: {
      summary: 'Criar novo produto',
      tags: ['Produtos'],
      description: 'Cria um novo produto com os dados fornecidos. O ID é gerado automaticamente.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Product'
            },
            example: {
              name: 'Notebook Dell',
              price: 2499.99,
              quantity: 10,
              category: 'Eletrônicos'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Produto criado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Product created successfully' },
                  data: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        },
        400: {
          description: 'Erro de validação',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationError' }
            }
          }
        },
        500: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    get: {
      summary: 'Listar todos os produtos',
      tags: ['Produtos'],
      description: 'Retorna uma lista com todos os produtos cadastrados em memória.',
      responses: {
        200: {
          description: 'Lista de produtos recuperada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Products retrieved successfully' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          }
        },
        500: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    }
  },
  '/products/{id}': {
    get: {
      summary: 'Obter produto por ID',
      tags: ['Produtos'],
      description: 'Retorna os dados de um produto específico pelo seu ID.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID único do produto',
          schema: {
            type: 'integer',
            example: 1
          }
        }
      ],
      responses: {
        200: {
          description: 'Produto recuperado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Product retrieved successfully' },
                  data: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        },
        404: {
          description: 'Produto não encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    put: {
      summary: 'Atualizar produto',
      tags: ['Produtos'],
      description: 'Atualiza os dados de um produto existente.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID único do produto',
          schema: {
            type: 'integer',
            example: 1
          }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', minLength: 3 },
                price: { type: 'number', minimum: 0.01 },
                quantity: { type: 'integer', minimum: 0 },
                category: { type: 'string' }
              }
            },
            example: {
              name: 'Notebook Dell Atualizado',
              price: 2299.99,
              quantity: 5,
              category: 'Eletrônicos'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Produto atualizado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Product updated successfully' },
                  data: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        },
        400: {
          description: 'Erro de validação',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationError' }
            }
          }
        },
        404: {
          description: 'Produto não encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Deletar produto',
      tags: ['Produtos'],
      description: 'Remove um produto do banco de dados em memória.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID único do produto',
          schema: {
            type: 'integer',
            example: 1
          }
        }
      ],
      responses: {
        200: {
          description: 'Produto deletado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Product deleted successfully' }
                }
              }
            }
          }
        },
        404: {
          description: 'Produto não encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    }
  }
};

module.exports = specs;
