import Image from 'next/image';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/Layout/Header';
import Footer from '@/Layout/Footer';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import userSlice from '../../reducers/user';

const SuccessPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ code: string; message: string }>({ code: '', message: '' });

  const searchParams = useSearchParams();
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  async function confirmPayment() {
    // TODO: API를 호출해서 서버에게 paymentKey, orderId, amount를 넘겨주세요.
    // 서버에선 해당 데이터를 가지고 승인 API를 호출하면 결제가 완료됩니다.
    // https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
    try {
      const response = await axios.post(
        'http://localhost:3085/sandbox-dev/api/v1/payments/confirm',
        JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      dispatch(userSlice.actions.subscribedUser(response.data.subscribePeriod));
      if (response.statusText === 'OK') {
        setIsConfirmed(true);
      }
    } catch (error: any) {
      setErrorMessage(error.response.data);
      console.log(error.response.data);
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <div
          className='wrapper w-100'
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {errorMessage?.message ? (
            <div style={{ fontSize: '2rem' }}>{errorMessage.message}</div>
          ) : (
            <>
              {isConfirmed ? (
                <div
                  className='flex-column align-center confirm-success w-100 max-w-540'
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <img src='https://static.toss.im/illusts/check-blue-spot-ending-frame.png' width='120' height='120' />
                  <h2 className='title' style={{ fontSize: '2.5rem' }}>
                    결제를 완료했어요
                  </h2>
                  <div className='response-section w-100'>
                    <div className='flex justify-between' style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                      <span className='response-label'>결제 금액 : </span>
                      <span id='amount' className='response-text'>
                        {amount}원
                      </span>
                    </div>
                    <div className='flex justify-between' style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                      <span className='response-label'>주문번호 : </span>
                      <span id='orderId' className='response-text'>
                        {orderId}
                      </span>
                    </div>
                    <div className='flex justify-between' style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                      <span className='response-label'>paymentKey : </span>
                      <span id='paymentKey' className='response-text'>
                        {paymentKey}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className='flex-column align-center confirm-loading w-100 max-w-540'
                  style={{
                    width: '100vw',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    className='flex-column align-center'
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <img src='https://static.toss.im/lotties/loading-spot-apng.png' width='120' height='120' />
                    <h2 className='title text-center' style={{ fontSize: '2.5rem' }}>
                      결제 요청까지 성공했어요.
                    </h2>
                    <h4 className='text-center description' style={{ fontSize: '1.8rem' }}>
                      결제 승인하고 완료해보세요.
                    </h4>
                  </div>
                  <div className='w-100'>
                    <button
                      className='btn primary w-100'
                      onClick={confirmPayment}
                      style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: '600',
                        fontSize: '1.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      결제 승인하기
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SuccessPage;
