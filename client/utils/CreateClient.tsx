import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { NextPageContext } from 'next';
import { setContext } from '@apollo/client/link/context';

export const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

const CreateClient = (ctx: NextPageContext | null) => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        cookie:
          (typeof window === 'undefined'
            ? ctx?.req?.headers.cookie || undefined
            : undefined) || '',
      },
    };
  });

  return new ApolloClient({
    credentials: 'include',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    ssrMode: true,
  });
};

export default CreateClient;
