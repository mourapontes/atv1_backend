const { Project, Profile, Technology, Feedback } = require('../models');

const defaultIncludes = [
  { model: Profile, as: 'profile', attributes: ['id', 'name', 'email'] },
  { model: Technology, as: 'technologies', attributes: ['id', 'name'], through: { attributes: [] } },
];

const projectRepository = {
  async create({ technologyIds, ...data }) {
    const project = await Project.create(data);
    if (technologyIds && technologyIds.length) {
      await project.setTechnologies(technologyIds);
    }
    return this.findById(project.id);
  },

  findById(id) {
    return Project.findByPk(id, { include: defaultIncludes });
  },

  findAll() {
    return Project.findAll({ include: defaultIncludes, order: [['createdAt', 'DESC']] });
  },

  findAllByProfile(profileId) {
    return Project.findAll({ where: { profileId }, include: defaultIncludes });
  },
};

module.exports = projectRepository;
