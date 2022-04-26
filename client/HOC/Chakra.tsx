import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  ChakraProvider,
  cookieStorageManager,
  localStorageManager,
} from '@chakra-ui/react';
import { NextPageContext } from 'next';

type ChakraProps = PropsWithChildren<{ cookies: string }>;

const Chakra: React.FC<ChakraProps> = ({ cookies, children }) => {
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManager(cookies)
      : localStorageManager;

  return (
    <ChakraProvider colorModeManager={colorModeManager}>
      {children}
    </ChakraProvider>
  );
};

export function getServerSideProps({ req }: NextPageContext) {
  return {
    props: {
      cookies: req?.headers?.cookie ?? '',
    },
  };
}

export default Chakra;
