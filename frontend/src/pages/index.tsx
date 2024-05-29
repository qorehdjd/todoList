import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Login from './login';
import Schedule from './Components/schedule';
import { AppDispatch, RootState } from '../../store';
import { autoLogin } from '../../reducers/user';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const me = useSelector((state: RootState) => state.user.me);

  useEffect(() => {
    (async () => {
      dispatch(autoLogin());
    })();
  }, [dispatch]);

  if (localStorage.getItem('autoLogin') && !me) {
    // 자동로그인 했을 때 로그인창이 뜨고 달력페이지로 가서 깜빡임 있는것을 처리
    return null;
  }

  return <>{me ? <Schedule /> : <Login />}</>;
};

export default Home;
