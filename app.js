// app.js включает основную логику сервера, запуск и подключение к базе данных

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const helmet = require('helmet');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const cardRoutes = require('./routes/cards');
const auth = require('./middlewares/auth');
const ErrorStatusNotFound = require('./utilits/errorStatusNotFound');
const handleError = require('./middlewares/handleError');
const userValidation = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
app.use(errors());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Подключилось к БД'))
  .catch((err) => console.log(`Ошибка: ${err.message}`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', userValidation, login);
app.post('/signup', userValidation, createUser);
app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use('*', () => {
  throw new ErrorStatusNotFound('Страница не найдена');
});
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
