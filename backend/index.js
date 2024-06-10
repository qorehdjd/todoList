const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const userRouer = require('./routes/user');
const postRouer = require('./routes/post');
const postsRouer = require('./routes/posts');

const passportConfig = require('./passport');

const hpp = require('hpp');
const { default: helmet } = require('helmet');
const { default: axios } = require('axios');
const Payment = require('./models/Payment');
const User = require('./models/User');

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
  app.set('trust proxy', 1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://www.count101.shop',
      'https://www.count101.shop',
      'http://count101.shop',
      'https://count101.shop',
    ],
    credentials: true,
    exposedHeaders: ['Autologin'],
  }),
);

app.use(cookieParser(process.env.SECRET_KEY));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === 'production',
    cookie: {
      httpOnly: true, // 스크립트 공격 방어 (XSS)
      secure: true,
      domain: process.env.NODE_ENV === 'production' && 'count101.shop',
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouer);
app.use('/post', postRouer);
app.use('/posts', postsRouer);
app.post('/sandbox-dev/api/v1/payments/confirm', async (req, res, next) => {
  try {
    const { paymentKey, orderId, amount } = req.body;
    console.log('amount', typeof amount);

    // 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
    // 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
    // @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
    const encryptedSecretKey = 'Basic ' + Buffer.from(process.env.TOSS_PAYMENT_SECRET_KEY + ':').toString('base64');

    // ------ 결제 승인 API 호출 ------
    // @docs https://docs.tosspayments.com/guides/payment-widget/integration#3-결제-승인하기
    // const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    //   method: 'POST',
    //   body: JSON.stringify({ orderId, amount, paymentKey }),
    //   headers: {
    //     Authorization: encryptedSecretKey,
    //     'Content-Type': 'application/json',
    //   },
    // });
    const response = await axios.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      JSON.stringify({ orderId, amount, paymentKey }),
      {
        headers: {
          Authorization: encryptedSecretKey,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('teste', response.data);
    const payment = await new Payment({
      userId: req.user._id,
      paymentKey: response.data.paymentKey,
      orderId: response.data.orderId,
    });
    await payment.save();
    const user = await User.findOne({ _id: req.user._id });
    if (amount === '9900') {
      const oneMonthLater = new Date(new Date().setMonth(new Date().getMonth() + 1));
      user.subscriptionPeriod = oneMonthLater;
    }
    if (amount === '99000') {
      const oneYearLater = new Date(new Date().setMonth(new Date().getMonth() + 12));
      user.subscriptionPeriod = oneYearLater;
    }
    await user.save();
    return res.status(200).json({ subscribePeriod: user.subscriptionPeriod });
  } catch (error) {
    console.error('rerer', error.response.data);
    res.status(error.response.status).send(error.response.data);
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`${PORT}번 실행중`);
});
