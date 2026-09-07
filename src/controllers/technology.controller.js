const technologyRepository = require('../repositories/technology.repository');
const { toTechnologyDTO } = require('../dtos/technology.dto');
const { HttpError } = require('../middlewares/errorHandler');

async function create(req, res, next) {
  try {
    const existing = await technologyRepository.findByName(req.body.name);
    if (existing) {
      throw new HttpError(409, 'Já existe uma tecnologia cadastrada com este nome.');
    }

    const technology = await technologyRepository.create(req.body);
    return res.status(201).json(toTechnologyDTO(technology));
  } catch (err) {
    return next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const technologies = await technologyRepository.findAll();
    return res.status(200).json(technologies.map(toTechnologyDTO));
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, findAll };
