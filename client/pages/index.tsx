import Head from 'next/head';
import type { NextPage, NextPageContext } from 'next';
import { Box } from '@chakra-ui/react';

import CreateClient from '../utils/CreateClient';
import { FeedDocument, Tweet } from '../graphql/generated/graphql';
import Feed from '../components/feed/Feed';

interface FeedProps {
  tweets: Tweet[];
}

const Home: NextPage<FeedProps> = ({ tweets }) => {
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
      <Feed tweets={tweets} />
    </Box>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const client = CreateClient(context?.req?.headers.cookie);

  const { data } = await client.query({
    query: FeedDocument,
    variables: {
      params: {
        page: 1,
        perPage: 10,
      },
    },
  });

  return {
    props: {
      ...(data.feed || []),
    },
  };
}

export default Home;
