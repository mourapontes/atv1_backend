const { Profile, Project } = require('../models');

const profileRepository = {
  create(data) {
    return Profile.create(data);
  },

  findById(id) {
    return Profile.findByPk(id, {
      include: [{ model: Project, as: 'projects', attributes: ['id', 'title'] }],
    });
  },

  findByEmail(email) {
    return Profile.findOne({ where: { email } });
  },
};

module.exports = profileRepository;
