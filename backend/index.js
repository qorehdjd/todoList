const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const Joi = require('joi');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const userRouer = require('./routes/user');
const postRouer = require('./routes/post');
const postsRouer = require('./routes/posts');

const passportConfig = require('./passport');

const hpp = require('hpp');
const { default: helmet } = require('helmet');
const { default: axios } = require('axios');
const Payment = require('./models/Payment');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
dotenv.config();
passportConfig();

const { PORT, MONGO_URI } = process.env;

// 주문 모델 정의 (models/Order.js 파일에서 정의된 모델 사용)
const deletePendingOrders = async () => {
  const expirationTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); // 24시간 이전
  await Order.deleteMany({ status: 'pending', createdAt: { $lt: expirationTime } });
};

// 스케줄러 설정
setInterval(deletePendingOrders, 24 * 60 * 60 * 1000); // 24시간마다 실행

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
    //cookie: {
    //  httpOnly: true, // 스크립트 공격 방어 (XSS)
    //   secure: true,
    //   domain: process.env.NODE_ENV === 'production' && 'count101.shop',
    // },
    //store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouer);
app.use('/post', postRouer);
app.use('/posts', postsRouer);
app.post('/order', async (req, res) => {
  const schema = Joi.object({
    amount: Joi.number().valid(9900, 99000).required(),
  });
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details.map((detail) => detail.message) });
  }

  const orderId = new Date().getTime() + '_' + uuidv4();
  const order = new Order({
    orderId,
    amount: value.amount,
    userId: req.user._id, // 로그인된 사용자 ID를 가져옴
    status: 'pending', // 초기 상태 설정
  });

  await order.save();
  res.status(201).json({ orderId });
});
app.post('/sandbox-dev/api/v1/payments/confirm', async (req, res, next) => {
  try {
    // 입력 값의 유효성을 검사하는 스키마 정의
    const schema = Joi.object({
      paymentKey: Joi.string().required(),
      orderId: Joi.string().required(),
      amount: Joi.number().positive().precision(2).required(),
    });
    const { paymentKey, orderId, amount } = req.body;
    // 입력 값 유효성 검사
    const { error, value } = schema.validate({ paymentKey, orderId, amount });

    // 유효성 검사 실패 시 에러 처리
    if (error) {
      return res.status(400).json({ error: error.details.map((detail) => detail.message) });
    }

    const order = await Order.findOne({ orderId });
    if (!order || order.amount !== amount || order.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid order or amount.' });
    }

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

    order.status = 'completed'; // 결제 성공 시 상태 업데이트
    await order.save();

    const payment = await new Payment({
      userId: req.user._id,
      paymentKey: response.data.paymentKey,
      orderId: response.data.orderId,
    });
    await payment.save();

    const user = await User.findOne({ _id: req.user._id });
    if (amount === 9900) {
      let oneMonthLater = new Date(new Date().setMonth(new Date().getMonth() + 1));
      if (user.subscriptionPeriod) {
        oneMonthLater = moment(req.user.subscriptionPeriod).add(1, 'months').format();
      }
      user.subscriptionPeriod = oneMonthLater;
    }
    if (amount === 99000) {
      const oneYearLater = new Date(new Date().setMonth(new Date().getMonth() + 12));
      if (user.subscriptionPeriod) {
        oneMonthLater = moment(req.user.subscriptionPeriod).add(12, 'months').format();
      }
      user.subscriptionPeriod = oneYearLater;
    }
    await user.save();
    return res.status(200).json({ subscribePeriod: user.subscriptionPeriod });
  } catch (error) {
    console.error('Payment confirmation error:', error.message);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ error: 'Payment processing failed. Please try again later.' });
    }

    // 결제 실패 시 상태 업데이트
    const order = await Order.findOne({ orderId: req.body.orderId });
    if (order) {
      order.status = 'cancelled';
      await order.save();
    }

    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`${PORT}번 실행중`);
});
