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

  // const [showCheckoutPage, setShowCheckoutPage] = useState(false);

  useEffect(() => {
    if (!me) {
      router.push('/');
    }
  }, [router, me]);

  const onclickPaymentItem = useCallback(
    (price: number) => async () => {
      if (!me) {
        return alert('로그인이 필요합니다');
      }
      const clientkey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_SECRET_KEY;
      if (clientkey) {
        await loadTossPayments(clientkey).then((tossPayments) => {
          // ------ 결제창 띄우기 ------
          tossPayments
            .requestPayment('카드', {
              // 결제수단 파라미터
              // 결제 정보 파라미터
              // 더 많은 결제 정보 파라미터는 결제창 Javascript SDK에서 확인하세요.
              // https://docs.tosspayments.com/reference/js-sdk
              amount: price, // 결제 금액
              orderId: new Date().getTime() + '_' + nanoid(), // 주문번호
              orderName: '정기 구독결제', // 구매상품
              customerName: '김토스', // 구매자 이름
              successUrl: `${window.location.origin}/success`,
              failUrl: `${window.location.origin}/fail`,
            })
            // ------ 결제창을 띄울 수 없는 에러 처리 ------
            // 메서드 실행에 실패해서 reject 된 에러를 처리하는 블록입니다.
            // 결제창에서 발생할 수 있는 에러를 확인하세요.
            // https://docs.tosspayments.com/reference/error-codes#결제창공통-sdk-에러
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
      // setShowCheckoutPage(true);
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
        {/* {showCheckoutPage ? <Checkout setShowCheckoutPage={setShowCheckoutPage} /> : null} */}
      </div>
      <Footer />
    </ProductPaymentLayout>
  );
};

export default ProductPayment;
