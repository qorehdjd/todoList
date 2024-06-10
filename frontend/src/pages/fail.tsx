import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/Layout/Header';
import Footer from '@/Layout/Footer';

export default function FailPage() {
  const { query } = useRouter();

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <main
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <div
            id='info'
            className='box_section'
            style={{
              width: '600px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              width='100px'
              src='https://static.toss.im/lotties/error-spot-no-loop-space-apng.png'
              alt='에러 이미지'
            />
            <h2 style={{ fontSize: '2.5rem' }}>결제를 실패했어요</h2>

            <div className='p-grid typography--p' style={{ marginTop: '1rem', fontSize: '1.8rem' }}>
              <div className='p-grid-col text--left'>
                <b>에러메시지</b>
              </div>
              <div className='p-grid-col text--right' id='message'>
                {query.code ?? 'UNKNOWN_ERROR'}
              </div>
            </div>
            <div className='p-grid typography--p' style={{ marginTop: '1rem', fontSize: '1.8rem' }}>
              <div className='p-grid-col text--left'>
                <b>에러코드</b>
              </div>
              <div className='p-grid-col text--right' id='code'>
                {query.message ?? '알 수 없음'}
              </div>
            </div>

            <div className='p-grid-col' style={{ marginTop: '1rem' }}>
              <Link
                href='https://docs.tosspayments.com/guides/payment-widget/integration'
                style={{ marginRight: '1.2rem' }}
              >
                <button className='button p-grid-col5' style={{ fontSize: '1.5rem' }}>
                  연동 문서
                </button>
              </Link>
              <Link href='https://discord.gg/A4fRFXQhRu'>
                <button className='button p-grid-col5' style={{ fontSize: '1.5rem' }}>
                  실시간 문의
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
