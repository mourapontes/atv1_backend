/**
 * Middleware factory: valida req.body contra um schema Joi.
 * Em caso de erro, responde 400 com a lista de mensagens de validação.
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: 'Erro de validação.',
        errors: error.details.map((d) => d.message),
      });
    }

    req.body = value;
    next();
  };
}

module.exports = validate;
