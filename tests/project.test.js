const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

async function createProfile(overrides = {}) {
  const res = await request(app)
    .post('/api/profiles')
    .send({ name: 'Ana Souza', email: 'ana@example.com', ...overrides });
  return res.body;
}

async function createTechnology(name) {
  const res = await request(app).post('/api/technologies').send({ name });
  return res.body;
}

describe('POST /api/projects', () => {
  it('cria um projeto com dados válidos e tecnologias', async () => {
    const profile = await createProfile();
    const tech = await createTechnology('Node.js');

    const res = await request(app).post('/api/projects').send({
      title: 'DevShowcase API',
      description: 'Backend do projeto',
      repositoryUrl: 'https://github.com/ana/devshowcase',
      profileId: profile.id,
      technologyIds: [tech.id],
    });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('DevShowcase API');
    expect(res.body.profile.id).toBe(profile.id);
    expect(res.body.technologies).toHaveLength(1);
    expect(res.body.technologies[0].name).toBe('Node.js');
  });

  it('rejeita título vazio', async () => {
    const profile = await createProfile();

    const res = await request(app).post('/api/projects').send({
      title: '',
      repositoryUrl: 'https://github.com/ana/devshowcase',
      profileId: profile.id,
    });

    expect(res.status).toBe(400);
  });

  it('rejeita repositoryUrl inválida', async () => {
    const profile = await createProfile();

    const res = await request(app).post('/api/projects').send({
      title: 'Projeto X',
      repositoryUrl: 'nao-e-url',
      profileId: profile.id,
    });

    expect(res.status).toBe(400);
  });

  it('rejeita profileId inexistente', async () => {
    const res = await request(app).post('/api/projects').send({
      title: 'Projeto X',
      repositoryUrl: 'https://github.com/ana/devshowcase',
      profileId: 999999,
    });

    expect(res.status).toBe(400);
  });

  it('rejeita technologyIds inexistentes', async () => {
    const profile = await createProfile();

    const res = await request(app).post('/api/projects').send({
      title: 'Projeto X',
      repositoryUrl: 'https://github.com/ana/devshowcase',
      profileId: profile.id,
      technologyIds: [999999],
    });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/projects', () => {
  it('lista todos os projetos', async () => {
    const profile = await createProfile();
    await request(app).post('/api/projects').send({
      title: 'Projeto 1',
      repositoryUrl: 'https://github.com/ana/projeto1',
      profileId: profile.id,
    });
    await request(app).post('/api/projects').send({
      title: 'Projeto 2',
      repositoryUrl: 'https://github.com/ana/projeto2',
      profileId: profile.id,
    });

    const res = await request(app).get('/api/projects');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('filtra projetos por profileId', async () => {
    const profile1 = await createProfile();
    const profile2 = await createProfile({ email: 'outra@example.com' });

    await request(app).post('/api/projects').send({
      title: 'Projeto do perfil 1',
      repositoryUrl: 'https://github.com/ana/p1',
      profileId: profile1.id,
    });
    await request(app).post('/api/projects').send({
      title: 'Projeto do perfil 2',
      repositoryUrl: 'https://github.com/ana/p2',
      profileId: profile2.id,
    });

    const res = await request(app).get(`/api/projects?profileId=${profile1.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Projeto do perfil 1');
  });
});
