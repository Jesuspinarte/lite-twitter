import Head from 'next/head';
import type { NextPage, NextPageContext } from 'next';
import { Box } from '@chakra-ui/react';

import CreateClient from '../utils/CreateClient';
import { FeedDocument } from '../graphql/generated/graphql';
import Feed, { FeedProps } from '../components/feed/Feed';

const Home: NextPage<FeedProps> = props => {
  return (
    <Box>
      <Head>
        <title>Lite Twitter</title>
        <meta
          name="description"
          content="Lite Twitter with GraphQL and Nextjs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Feed {...props} />
    </Box>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const client = CreateClient(context?.req?.headers.cookie);

  const { data } = await client.query({
    query: FeedDocument,
    variables: {
      params: {
        skip: 0,
        take: 4,
      },
    },
  });

  return {
    props: {
      ...(data.feed || { tweets: [], nextSkip: null, nextTake: null }),
    },
  };
}

export default Home;
