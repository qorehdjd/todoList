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
  }
  ol {
    list-style: none;
  }
  html {
    font-size: 62.5%;
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
            <title>todoList</title>
          </Head>
          <Component {...pageProps.pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
