import {
  Box,
  IconButton,
  Link,
  ListItem,
  UnorderedList,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useLogoutMutation } from '../graphql/generated/graphql';
import { useRouter } from 'next/router';
import { useUserContext } from '../providers/UserProvider';

const Nav: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const modeBgColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
  const { user, setUser } = useUserContext();

  const router = useRouter();
  const [logOut] = useLogoutMutation({
    onCompleted: () => router.push('/login'),
  });

  const handleLogOut = async () => {
    setUser(null);
    await logOut();
  };

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      backgroundColor="transparent"
    >
      {user && router.pathname !== '/login' && router.pathname !== '/register' && (
        <UnorderedList>
          <ListItem>
            <NextLink href="/" passHref>
              <Link>Home</Link>
            </NextLink>
          </ListItem>
          <ListItem>
            <NextLink href="/login" passHref>
              <Link>login</Link>
            </NextLink>
          </ListItem>
          <ListItem>
            <NextLink href="/profile" passHref>
              <Link>Profile</Link>
            </NextLink>
          </ListItem>
          <ListItem>
            <NextLink href="/register" passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
          <ListItem>
            <a onClick={handleLogOut} style={{ cursor: 'pointer' }}>
              Log Out
            </a>
          </ListItem>
        </UnorderedList>
      )}
      <Box m={2} position="absolute" right={0} top={0} outline="none">
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          aria-label={colorMode === 'light' ? 'Light mode' : 'Dark mode'}
          backgroundColor={modeBgColor}
          _focus={{ outline: 'none' }}
        />
      </Box>
    </Box>
  );
};

export default Nav;
