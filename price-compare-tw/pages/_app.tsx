import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '../components/Header';
import axios from 'axios';
import { SWRConfig } from 'swr';

// axios.defaults.baseURL = 'http://localhost:3000';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: (url) => axios(url).then((res) => res.data) }}>
      <Header />
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
