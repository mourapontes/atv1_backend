const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/technologies', () => {
  it('cria uma tecnologia com nome válido', async () => {
    const res = await request(app).post('/api/technologies').send({ name: 'Node.js' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Node.js' });
    expect(res.body.id).toBeDefined();
  });

  it('rejeita nome vazio', async () => {
    const res = await request(app).post('/api/technologies').send({ name: '' });
    expect(res.status).toBe(400);
  });

  it('rejeita nome duplicado', async () => {
    await request(app).post('/api/technologies').send({ name: 'Node.js' });
    const res = await request(app).post('/api/technologies').send({ name: 'Node.js' });
    expect(res.status).toBe(409);
  });
});

describe('GET /api/technologies', () => {
  it('lista todas as tecnologias cadastradas', async () => {
    await request(app).post('/api/technologies').send({ name: 'Node.js' });
    await request(app).post('/api/technologies').send({ name: 'React' });

    const res = await request(app).get('/api/technologies');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.map((t) => t.name).sort()).toEqual(['Node.js', 'React']);
  });
});
