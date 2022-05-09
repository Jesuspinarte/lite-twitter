import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Flex,
  Heading,
  Link,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';

import { SignForm } from '../components/sign/SignForm';
import Bird from '../components/assets/Bird';

const Register: NextPage = () => {
  const infoBgColor = useColorModeValue('teal.300', 'teal.200');
  const headingColor = useColorModeValue('gray.800', 'gray.600');

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
        <Box
          width="50%"
          height="100%"
          backgroundColor={infoBgColor}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexFlow="column"
        >
          <Heading
            mb={10}
            fontSize="40px"
            fontWeight="300"
            color={headingColor}
          >
            Join and connect with the world!
          </Heading>
          <Link
            href="https://www.freepik.es/vectores/pajaros"
            isExternal
            _focus={{ outline: 'none' }}
          >
            <Bird />
            <VisuallyHidden>
              Vector de pajaros creado por sentavio - www.freepik.es
            </VisuallyHidden>
          </Link>
        </Box>
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
