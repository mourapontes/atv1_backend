const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL não definida. Configure a connection string do PostgreSQL no .env (ex.: postgres://usuario:senha@localhost:5432/devshowcase).'
  );
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions:
    process.env.DB_SSL === 'true'
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
});

module.exports = sequelize;
