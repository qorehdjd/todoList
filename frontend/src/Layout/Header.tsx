import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../reducers/user';

const HeaderLayout = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 3rem 5rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  .logo_wrapper {
    position: relative;
    height: 100%;
    min-height: 25px;
    a {
      position: relative;
      height: 100%;
      display: block;
      img {
        cursor: pointer;
        position: relative !important;
      }
    }
  }
  .lists_wrapper {
    .login {
      margin-right: 2rem;
    }
    button {
      color: #000000;
      text-decoration: none;
      font-size: 2rem;
      background-color: white;
      border: none;
      cursor: pointer;
      margin-right: 2rem;
    }
    button:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    a {
      color: #000000;
      text-decoration: none;
      font-size: 2rem;
    }
    a:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
    }
  }
`;

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();

  const me = useSelector((state: RootState) => state.user.me);

  const onClickLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  return (
    <HeaderLayout>
      <div className='logo_wrapper'>
        <Link href='/'>
          <Image src='/imgs/walk101-logo.png' fill alt='logo_img' />
        </Link>
      </div>
      <div className='lists_wrapper'>
        {me ? (
          <button onClick={onClickLogout}>로그아웃</button>
        ) : (
          <Link href='/login' className='login'>
            로그인
          </Link>
        )}
        <Link href='/productPayment'>상품결제</Link>
      </div>
    </HeaderLayout>
  );
};

export default Header;
