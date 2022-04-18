import type { NextPage } from "next";
import Head from "next/head";
import { Box, Container, Heading } from "@chakra-ui/react";

const Home: NextPage = () => {
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

export default Home;
