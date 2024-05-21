import React, { useState } from 'react';
import Login from './login';
import Schedule from './schedule';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Home = () => {
  const me = useSelector((state: RootState) => state.user.me);

  return <>{me ? <Schedule /> : <Login />}</>;
};

export default Home;
