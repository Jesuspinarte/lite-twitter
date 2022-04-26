import App, { AppContext } from 'next/app';
import type { AppProps } from 'next/app';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';

import Chakra from '../HOC/Chakra';
import Nav from '../components/Nav';
import { httpLink } from '../utils/CreateClient';

export const client = new ApolloClient({
  credentials: 'include',
  link: httpLink,
  cache: new InMemoryCache(),
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <Chakra cookies={pageProps.cookies}>
        <Nav />
        <Component {...pageProps} />
      </Chakra>
    </ApolloProvider>
  );
};

MyApp.getInitialProps = ({ ctx: { req } }: AppContext) => {
  return {
    pageProps: {
      cookies: req?.headers.cookie ?? 'chakra-ui-color-mode=dark',
    },
  };
};

export default MyApp;
