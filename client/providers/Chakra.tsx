import { NextPageContext } from 'next';
import type { PropsWithChildren } from 'react';
import {
  ChakraProvider,
  cookieStorageManager,
  extendTheme,
  localStorageManager,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

type ChakraProps = PropsWithChildren<{ cookies: string }>;

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('#eee', 'gray.800')(props),
      },
    }),
  },
});

const Chakra: React.FC<ChakraProps> = ({ cookies, children }) => {
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManager(cookies)
      : localStorageManager;

  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
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
