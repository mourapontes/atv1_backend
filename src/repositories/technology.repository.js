const { Technology } = require('../models');

const technologyRepository = {
  create(data) {
    return Technology.create(data);
  },

  findAll() {
    return Technology.findAll({ order: [['name', 'ASC']] });
  },

  findByIds(ids = []) {
    if (!ids.length) return Promise.resolve([]);
    return Technology.findAll({ where: { id: ids } });
  },

  findByName(name) {
    return Technology.findOne({ where: { name } });
  },
};

module.exports = technologyRepository;
