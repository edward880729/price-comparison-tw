import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '../components/Header';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
