// Garante que os testes rodem contra um banco PostgreSQL isolado, mesmo se .env definir outro DATABASE_URL.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/devshowcase_test';
