const Joi = require('joi');

// DTO de entrada: dados aceitos para criar uma Technology.
const createTechnologySchema = Joi.object({
  name: Joi.string().trim().min(1).max(60).required().messages({
    'string.empty': 'O campo "name" não pode ser vazio.',
    'any.required': 'O campo "name" é obrigatório.',
  }),
});

// DTO de saída.
function toTechnologyDTO(technology) {
  if (!technology) return null;
  const plain = technology.toJSON ? technology.toJSON() : technology;
  return {
    id: plain.id,
    name: plain.name,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

module.exports = { createTechnologySchema, toTechnologyDTO };
