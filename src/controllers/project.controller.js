const projectRepository = require('../repositories/project.repository');
const profileRepository = require('../repositories/profile.repository');
const technologyRepository = require('../repositories/technology.repository');
const { toProjectDTO } = require('../dtos/project.dto');
const { HttpError } = require('../middlewares/errorHandler');

async function create(req, res, next) {
  try {
    const { profileId, technologyIds } = req.body;

    const profile = await profileRepository.findById(profileId);
    if (!profile) {
      throw new HttpError(400, `Profile com id ${profileId} não encontrado.`);
    }

    if (technologyIds && technologyIds.length) {
      const foundTechnologies = await technologyRepository.findByIds(technologyIds);
      if (foundTechnologies.length !== technologyIds.length) {
        throw new HttpError(400, 'Uma ou mais tecnologias informadas não existem.');
      }
    }

    const project = await projectRepository.create(req.body);
    return res.status(201).json(toProjectDTO(project));
  } catch (err) {
    return next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const { profileId } = req.query;
    const projects = profileId
      ? await projectRepository.findAllByProfile(profileId)
      : await projectRepository.findAll();

    return res.status(200).json(projects.map(toProjectDTO));
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, findAll };
