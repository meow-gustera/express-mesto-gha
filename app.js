// app.js включает основную логику сервера, запуск и подключение к базе данных

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { errorStatusNotFound } = require('./utilits/error');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Подключилось к БД'))
  .catch((err) => console.log(`Ошибка: ${err.message}`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// решение авторизации из задания
app.use((req, res, next) => {
  req.user = {
    _id: '645fa04e1d71adb13f4b6abe',
  };
  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', (req, res) => {
  res.status(errorStatusNotFound).send({ message: 'Был запрошен несуществующий роутер' });
});

app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
