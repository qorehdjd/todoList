const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const { id, password, nickname } = req.body;
  try {
    const exId = await User.findOne({ id });
    if (exId) {
      return res.status(400).send('이미 존재하는 아이디입니다');
    }
    const exUser = await User.findOne({ nickname });
    if (exUser) {
      return res.status(400).send('이미 존재하는 닉네임입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await new User({ id, nickname, password: hashedPassword });
    await user.save();
    return res.status(200).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/autoLogin', async (req, res, next) => {
  try {
    const userId = req.session.passport?.user;
    if (req.session.autoLogin) {
      // 자동로그인 클릭 했을 때 로그인 바로 가능
      const fullUserWithoutPassword = await User.findOne(
        { _id: userId },
        {
          password: 0,
        },
      );
      return res.status(200).json(fullUserWithoutPassword);
    }
    return res.status(200).json(null);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', (req, res, next) => {
  try {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      if (info) {
        console.log(info);
        return res.status(401).send(info.reason);
      }
      return req.login(user, async (loginErr) => {
        // passport 자체 로그인 에러 login함수 실행되면 serializeUser실행
        if (loginErr) {
          console.error(loginErr);
          return next(loginErr);
        }
        // res.setHeader('Cookie', 'chgrgr') 알아서 쿠키를 만들어준다.
        const fullUserWithoutPassword = await User.findOne(
          { _id: user._id },
          {
            password: 0,
          },
        );
        // autoLogin
        if (req.body.autoLoginChecked) {
          req.session.autoLogin = true;
          req.session.cookie.maxAge = new Date(Date.now() + 24 * 60 * 60 * 60 * 60 * 60);
          res.setHeader('autoLogin', true); // 프론트 단에서 자동로그인 할 때 로그인페이지가 보였다가 달력 페이지로 가는 문제 해결 (ux경험 해결)
        }

        req.session.save(() => {
          return res.status(200).json(fullUserWithoutPassword);
        });
      });
    })(req, res, next);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/logout', (req, res, next) => {
  if (req.cookies['keep-login']) {
    res.clearCookie('keep-login');
  }
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.clearCookie('connect.sid');
    return res.status(200).send('ok');
  });
});

module.exports = router;
