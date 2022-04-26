import { AppContext } from 'next/app';
import type { AppProps } from 'next/app';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import Chakra from '../providers/Chakra';
import Nav from '../components/Nav';
import CreateClient, { httpLink } from '../utils/CreateClient';
import { CurrentUserDocument } from '../graphql/generated/graphql';
import UserProvider from '../providers/UserProvider';

export const client = new ApolloClient({
  credentials: 'include',
  link: httpLink,
  cache: new InMemoryCache(),
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { user, cookies, ...props } = pageProps;

  return (
    <ApolloProvider client={client}>
      <Chakra cookies={cookies}>
        <UserProvider user={user}>
          <Nav />
          <Component {...props} />
        </UserProvider>
      </Chakra>
    </ApolloProvider>
  );
};

MyApp.getInitialProps = async ({ ctx: { req } }: AppContext) => {
  const client = CreateClient(req?.headers.cookie);
  const pageProps = {
    cookies: req?.headers.cookie ?? 'chakra-ui-color-mode=dark',
  };

  const {
    data: {
      currentUser: { user },
    },
  } = await client.query({
    query: CurrentUserDocument,
  });

  return {
    pageProps: {
      ...pageProps,
      user,
    },
  };
};

export default MyApp;
