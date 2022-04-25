import type { NextPage } from "next";
import { gql } from "@apollo/client";
import client from "../apollo-client";

import Head from "next/head";
import { Box, Container, Heading } from "@chakra-ui/react";

const Home: NextPage<any> = ({ feed }) => {
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

export async function getServerSideProps() {
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
      feed: data,
    },
  };
}

export default Home;
