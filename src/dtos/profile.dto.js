const Joi = require('joi');

// DTO de entrada: dados aceitos para criar um Profile.
const createProfileSchema = Joi.object({
  name: Joi.string().trim().min(1).max(120).required().messages({
    'string.empty': 'O campo "name" não pode ser vazio.',
    'any.required': 'O campo "name" é obrigatório.',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.email': 'O campo "email" deve ser um e-mail válido.',
    'any.required': 'O campo "email" é obrigatório.',
  }),
  bio: Joi.string().trim().allow('', null).max(1000),
  avatarUrl: Joi.string().trim().uri().allow('', null).messages({
    'string.uri': 'O campo "avatarUrl" deve ser uma URL válida.',
  }),
});

// DTO de saída: formato exposto pela API para um Profile.
function toProfileDTO(profile) {
  if (!profile) return null;
  const plain = profile.toJSON ? profile.toJSON() : profile;
  return {
    id: plain.id,
    name: plain.name,
    email: plain.email,
    bio: plain.bio ?? null,
    avatarUrl: plain.avatarUrl ?? null,
    projects: plain.projects ? plain.projects.map((p) => ({ id: p.id, title: p.title })) : undefined,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

module.exports = { createProfileSchema, toProfileDTO };
