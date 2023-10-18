import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { store } from "../state/Store";
import { Provider } from 'react-redux';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }: AppProps ) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp
