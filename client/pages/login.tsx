import type { NextPage } from 'next';
import Head from 'next/head';
import { Box } from '@chakra-ui/react';

import { SignForm } from '../components/SignForm';

const Home: NextPage = () => {
  return (
    <Box as="main">
      <Head>
        <title>Lite Twiiter | Sign In</title>
        <meta
          name="description"
          content="Lite Twitter with GraphQL and Nextjs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignForm />
    </Box>
  );
};

export default Home;
