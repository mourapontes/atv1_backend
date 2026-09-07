const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3555;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Em desenvolvimento, sincroniza os models com o schema do banco automaticamente.
    await sequelize.sync();
    console.log('Modelos sincronizados com o banco de dados.');

    app.listen(PORT, () => {
      console.log(`DevShowcase API rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Falha ao iniciar a aplicação:', err);
    process.exit(1);
  }
}

start();
