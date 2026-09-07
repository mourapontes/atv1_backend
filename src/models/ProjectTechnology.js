const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Tabela de junção para o relacionamento N:N entre Project e Technology.
 */
class ProjectTechnology extends Model {}

ProjectTechnology.init(
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    technologyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'technologies',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'ProjectTechnology',
    tableName: 'project_technologies',
    timestamps: false,
  }
);

module.exports = ProjectTechnology;
