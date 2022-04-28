import Head from 'next/head';
import type { NextPage, NextPageContext } from 'next';
import { Box, Container, Heading } from '@chakra-ui/react';

import CreateClient from '../utils/CreateClient';
import { FeedDocument } from '../graphql/generated/graphql';

interface FeedProps {
  feed: any;
}

const Home: NextPage<FeedProps> = ({ feed }) => {
  // console.table(feed?.tweets);

  return (
    <Box as="main">
      <Head>
        <title>Lite Twitter</title>
        <meta
          name="description"
          content="Lite Twitter with GraphQL and Nextjs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Heading as="h1">¡Holi!</Heading>
      </Container>
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
        perPage: 2,
      },
    },
  });

  return {
    props: {
      feed: data.feed,
    },
  };
}

export default Home;
