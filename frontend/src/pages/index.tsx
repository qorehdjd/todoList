import React, { useEffect, useState } from 'react';
import Login from './login';
import Schedule from './schedule';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { autoLogin } from '../../reducers/user';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      dispatch(autoLogin());
    })();
  }, [dispatch]);

  const me = useSelector((state: RootState) => state.user.me);

  return <>{me ? <Schedule /> : <Login />}</>;
};

export default Home;
