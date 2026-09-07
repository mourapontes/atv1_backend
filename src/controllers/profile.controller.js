const profileRepository = require('../repositories/profile.repository');
const { toProfileDTO } = require('../dtos/profile.dto');
const { HttpError } = require('../middlewares/errorHandler');

async function create(req, res, next) {
  try {
    const existing = await profileRepository.findByEmail(req.body.email);
    if (existing) {
      throw new HttpError(409, 'Já existe um perfil cadastrado com este e-mail.');
    }

    const profile = await profileRepository.create(req.body);
    return res.status(201).json(toProfileDTO(profile));
  } catch (err) {
    return next(err);
  }
}

async function findById(req, res, next) {
  try {
    const { id } = req.params;
    const profile = await profileRepository.findById(id);

    if (!profile) {
      throw new HttpError(404, 'Perfil não encontrado.');
    }

    return res.status(200).json(toProfileDTO(profile));
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, findById };
