import type { NextPage, NextPageContext } from 'next';
import { gql } from '@apollo/client';

import Head from 'next/head';
import { Box, Container, Heading } from '@chakra-ui/react';
import CreateClient from '../utils/CreateClient';

interface FeedProps {
  feed: any;
}

const Home: NextPage<FeedProps> = ({ feed }) => {
  console.log(feed);

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
  const client = CreateClient(context);

  const { data } = await client.query({
    query: gql`
      query {
        feed {
          errors {
            field
            message
            type
          }
          tweets {
            id
            text
            user {
              username
              id
            }
            hashtags
            mentions {
              id
              username
              name
              email
              createdAt
            }
            comments {
              text
              hashtags
              text
              mentions {
                username
              }
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      feed: data.feed,
    },
  };
}

export default Home;
