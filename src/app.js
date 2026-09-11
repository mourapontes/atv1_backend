require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

app.use(errorHandler);

module.exports = app;
