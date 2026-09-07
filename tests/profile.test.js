const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/profiles', () => {
  it('cria um perfil com dados válidos', async () => {
    const res = await request(app).post('/api/profiles').send({
      name: 'Ana Souza',
      email: 'ana@example.com',
      bio: 'Dev backend',
      avatarUrl: 'https://example.com/ana.png',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Ana Souza', email: 'ana@example.com' });
    expect(res.body.id).toBeDefined();
  });

  it('rejeita cadastro sem name', async () => {
    const res = await request(app).post('/api/profiles').send({ email: 'sem-nome@example.com' });
    expect(res.status).toBe(400);
  });

  it('rejeita e-mail inválido', async () => {
    const res = await request(app).post('/api/profiles').send({ name: 'Fulano', email: 'nao-e-email' });
    expect(res.status).toBe(400);
  });

  it('rejeita avatarUrl inválida', async () => {
    const res = await request(app).post('/api/profiles').send({
      name: 'Fulano',
      email: 'fulano@example.com',
      avatarUrl: 'nao-e-url',
    });
    expect(res.status).toBe(400);
  });

  it('rejeita e-mail duplicado', async () => {
    await request(app).post('/api/profiles').send({ name: 'Ana Souza', email: 'ana@example.com' });
    const res = await request(app).post('/api/profiles').send({ name: 'Outra Ana', email: 'ana@example.com' });
    expect(res.status).toBe(409);
  });
});

describe('GET /api/profiles/:id', () => {
  it('retorna o perfil existente', async () => {
    const created = await request(app).post('/api/profiles').send({
      name: 'Ana Souza',
      email: 'ana@example.com',
    });

    const res = await request(app).get(`/api/profiles/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
    expect(res.body.projects).toEqual([]);
  });

  it('retorna 404 para perfil inexistente', async () => {
    const res = await request(app).get('/api/profiles/999999');
    expect(res.status).toBe(404);
  });
});
