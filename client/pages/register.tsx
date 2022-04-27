import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';

import { SignForm } from '../components/SignForm';

const Register: NextPage = () => {
  const infoBgColor = useColorModeValue('teal.300', 'teal.200');

  return (
    <Box as="main">
      <Head>
        <title>Lite Twiiter | Register</title>
        <meta
          name="description"
          content="Lite Twitter with GraphQL and Nextjs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="article" height="100vh" width="100vw">
        <Box width="50%" height="100%" backgroundColor={infoBgColor} />
        <Flex
          width="50%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          boxShadow="-1px 0 20px 1px #111"
        >
          <SignForm signIn={false} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Register;
