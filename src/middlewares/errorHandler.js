const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

/**
 * Middleware central de tratamento de erros.
 * Traduz erros do Sequelize e erros customizados em respostas HTTP apropriadas.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      message: 'Violação de restrição de unicidade.',
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      message: 'Referência inválida: entidade relacionada não encontrada.',
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: 'Erro de validação.',
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err); // eslint-disable-line no-console
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { errorHandler, HttpError };
