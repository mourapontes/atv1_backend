const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Technology extends Model {}

Technology.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'O nome da tecnologia não pode ser vazio.' },
      },
    },
  },
  {
    sequelize,
    modelName: 'Technology',
    tableName: 'technologies',
    timestamps: true,
  }
);

module.exports = Technology;
