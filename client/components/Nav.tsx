import {
  Box,
  IconButton,
  ListItem,
  UnorderedList,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useLogoutMutation } from '../graphql/generated/graphql';
import { useRouter } from 'next/router';
import { useUserContext } from '../providers/UserProvider';

const Nav: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const modeBgColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
  const { setUser } = useUserContext();

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
      <UnorderedList>
        <ListItem>
          <Link href="/">
            <a>Home</a>
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/login">
            <a>login</a>
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/profile">
            <a>Profile</a>
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/register">
            <a>Register</a>
          </Link>
        </ListItem>
        <ListItem>
          <a onClick={handleLogOut} style={{ cursor: 'pointer' }}>
            Log Out
          </a>
        </ListItem>
      </UnorderedList>
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
