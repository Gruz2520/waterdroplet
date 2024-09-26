import '@/public/vendor/fonts.scss';
import '@/styles/globalVariables.scss';
import '@/styles/highlight.scss';
import type { AppProps } from 'next/app';
import store from '@/store/store';
import { Provider } from 'react-redux';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel='shortcut icon' href='/img/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/img/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/img/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/img/favicon-16x16.png'
        />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
