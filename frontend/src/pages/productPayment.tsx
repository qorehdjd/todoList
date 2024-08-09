import Footer from '@/Layout/Footer';
import Header from '@/Layout/Header';
import React, { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { IoMdCheckmark } from 'react-icons/io';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useRouter } from 'next/router';
import axios from 'axios';

const ProductPaymentLayout = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  h2 {
    text-align: center;
    font-size: 2rem;
  }
  .payment_select_wrapper {
    display: flex;
    font-size: 2rem;
    text-align: center;
    justify-content: center;
    align-items: center;
    height: 600px;
    padding: 10px 20px;
    width: 600px;
    border-radius: 4px;
    background-color: white;
    .payment_item {
      margin-right: 3rem;
      background-color: rgba(247, 247, 249, 0.6);
      height: 600px;
      ul {
        margin-top: 1.5rem;
      }
      .payment_btn_wrapper {
        button {
          width: 100%;
          background-color: #000000;
          color: #ffffff;
          padding: 10px 5px;
          border-radius: 5px;
          margin-top: 2rem;
          font-weight: 600;
          font-size: 1.4rem;
          cursor: pointer;
          a {
            color: white;
            text-decoration: none;
            display: inline-block;
            width: 100%;
          }
        }
      }
    }
  }
`;

const ProductPayment = () => {
  const router = useRouter();
  const me = useSelector((state: RootState) => state.user.me);

  const createOrder = async (amount: number) => {
    const response = await axios.post('https://api.count101.shop/order', { amount });
    return response.data.orderId;
  };

  const onclickPaymentItem = useCallback(
    (price: number) => async () => {
      if (!me) {
        return alert('로그인이 필요합니다');
      }
      const clientkey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_SECRET_KEY;
      if (clientkey) {
        const orderId = await createOrder(price);

        await loadTossPayments(clientkey).then((tossPayments) => {
          // ------ 결제창 띄우기 ------
          tossPayments
            .requestPayment('카드', {
              amount: price, // 결제 금액
              orderId, // 주문번호
              orderName: '정기 구독결제', // 구매상품
              customerName: '김토스', // 구매자 이름
              successUrl: `${window.location.origin}/success`,
              failUrl: `${window.location.origin}/fail`,
            })
            .catch(function (error) {
              console.log('errror', error);
              if (error.code === 'USER_CANCEL') {
                // 결제 고객이 결제창을 닫았을 때 에러 처리
              } else if (error.code === 'INVALID_CARD_COMPANY') {
                // 유효하지 않은 카드 코드에 대한 에러 처리
              }
            });
        });
      }
    },
    [me],
  );

  return (
    <ProductPaymentLayout>
      <Header />
      <div
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, .25)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div className='payment_select_wrapper'>
          <div className='payment_item'>
            <h4>월간 결제</h4>
            <div>₩ 9,900원</div>
            <div className='payment_btn_wrapper'>
              <button onClick={onclickPaymentItem(9900)}>선택하기</button>
            </div>
            <ul>
              <li>
                <IoMdCheckmark />
                <span>날짜별 계획들 기록</span>
              </li>
              <li>
                <IoMdCheckmark />
                <span> 월별 계획들 합계 제공</span>
              </li>
            </ul>
          </div>
          <div className='payment_item'>
            <h4>연간 결제</h4>
            <div>₩ 99,000원</div>
            <div className='payment_btn_wrapper'>
              <button onClick={onclickPaymentItem(99000)}>선택하기</button>
            </div>
            <ul>
              <li>
                <IoMdCheckmark />
                <span>날짜별 계획들 기록</span>
              </li>
              <li>
                <IoMdCheckmark />
                <span> 월별 계획들 합계 제공</span>
              </li>
              <li>
                <IoMdCheckmark />
                <span>자동 로그인 제공</span>
              </li>
              <li>
                <IoMdCheckmark />
                <span>최근 기록들 불러오기</span>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '600', marginTop: '1.5rem' }}>
          월간/연간 결제시 이용기간이 지나면
          <br />
          서비스를 이용하실 수 없습니다.
        </div>
        <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '600', marginTop: '1.5rem' }}>
          월간/연간 결제시 홈페이지 내에서 일정표(기록표)
          <br />
          서비스를 이용하실 수 있습니다.
        </div>
        <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '600', marginTop: '1.5rem' }}>
          월간/연간 결제를 한 후, 다시 로그인 하거나 왼쪽 상단에 로고를 누르면
          <br />
          서비스를 이용하실 수 있습니다.
        </div>
        {/* {showCheckoutPage ? <Checkout setShowCheckoutPage={setShowCheckoutPage} /> : null} */}
      </div>
      <Footer />
    </ProductPaymentLayout>
  );
};

export default ProductPayment;
