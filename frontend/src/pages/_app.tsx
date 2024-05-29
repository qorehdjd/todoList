import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Provider } from 'react-redux';
import store, { persistor } from '../../store';
import { PersistGate } from 'redux-persist/integration/react';
config.autoAddCss = false;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ol {
    list-style: none;
  }
  html {
    font-size: 62.5%;
  }

  @media screen and (max-width: 1200px) {
    html {
      font-size: 60%;
    }
  }
  @media screen and (max-width: 600px) {
    html {
      font-size: 50%;
    }
  }
`;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <GlobalStyle />
          <Head>
            <meta charSet='utf-8' />
            <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1' />
            <meta
              name='description'
              content='사용자가 원하는 날짜를 클릭하여 일정들을 추가할 수 있는 날짜 어플리케이션입니다.'
            />
            <meta name='keywords' content='일정, 달력, 날짜' />
            <meta name='author' content='james' />
            <title>todoList</title>
          </Head>
          <Component {...pageProps.pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
