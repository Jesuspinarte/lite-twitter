import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';

// export const httpLink = createHttpLink({
//   uri: 'http://localhost:4000/graphql',
//   credentials: 'include',
// });

export const httpLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

export const newSplitLink = () => {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: 'ws://localhost:4000/graphql',
      connectionParams: () => {
        return {
          Authorization: `Bearer aksldjaksl`,
        };
      },
    }),
  );

  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );
};

const CreateClient = (cookie?: string | null) => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        cookie:
          (typeof window === 'undefined' ? cookie || undefined : undefined) ||
          '',
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
