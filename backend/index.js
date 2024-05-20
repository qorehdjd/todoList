const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const userRouer = require('./routes/user');
const postRouer = require('./routes/post');
const passportConfig = require('./passport');

const hpp = require('hpp');
const { default: helmet } = require('helmet');

const app = express();
dotenv.config();
passportConfig();

const { PORT, MONGO_URI } = process.env;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected!'))
  .catch((err) => {
    console.error(err);
  });

if (process.env.NODE_ENV === 'production') {
  app.use(hpp());
  app.use(helmet({ contentSecurityPolicy: false }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);

app.use(cookieParser(process.env.SECRET_KEY));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // 스크립트 공격 방어 (XSS)
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouer);
app.use('/post', postRouer);

app.listen(PORT, () => {
  console.log(`${PORT}번 실행중`);
});
