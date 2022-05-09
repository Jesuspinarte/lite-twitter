import Head from 'next/head';
import type { NextPage, NextPageContext } from 'next';
import { Box } from '@chakra-ui/react';
import CreateClient from 'utils/CreateClient';

import { TweetWithCommentsDocument } from 'graphql/generated/graphql';
import { TweetDisplay, TweetDisplayProps } from 'components/feed/TweetDisplay';

const Home: NextPage<TweetDisplayProps> = props => {
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
      <TweetDisplay {...props} />
    </Box>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const client = CreateClient(context?.req?.headers.cookie);

  const { id } = context.query;

  const { data } = await client.query({
    query: TweetWithCommentsDocument,
    variables: {
      params: {
        skip: 0,
        take: 4,
        tweetId: id,
      },
    },
  });

  return {
    props: {
      ...(data.tweetComments || {
        tweet: null,
        comments: [],
        nextSkip: null,
        nextTake: null,
      }),
    },
  };
}

export default Home;
