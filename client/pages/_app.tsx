import { AppContext } from 'next/app';
import type { AppProps } from 'next/app';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import Chakra from '../providers/Chakra';
import Nav from '../components/Nav';
import CreateClient, { httpLink } from '../utils/CreateClient';
import { CurrentUserDocument } from '../graphql/generated/graphql';
import UserProvider from '../providers/UserProvider';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const client = new ApolloClient({
  credentials: 'include',
  link: httpLink,
  cache: new InMemoryCache(),
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { user, cookies, ...props } = pageProps;
  const { pathname } = useRouter();

  return (
    <ApolloProvider client={client}>
      <Chakra cookies={cookies}>
        <UserProvider user={user}>
          {pathname !== '/login' && pathname !== '/register' ? (
            <Box w="100%" maxW="1200px" minH="100vh" m="auto" pt={4} pb={4}>
              <Grid templateColumns="repeat(12, 1fr)" gap={4} height='100%'>
                <GridItem m={0} w="100%" colSpan={3}>
                  <Nav />
                </GridItem>
                <GridItem m={0} w="100%" colSpan={6}>
                  <Component {...props} />
                </GridItem>
                <GridItem m={0} w="100%" colSpan={3} />
              </Grid>
            </Box>
          ) : (
            <>
              <Nav />
              <Component {...props} />
            </>
          )}
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
