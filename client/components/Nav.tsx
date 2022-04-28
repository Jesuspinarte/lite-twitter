import {
  Avatar,
  Box,
  IconButton,
  Link,
  List,
  ListItem,
  Text,
  useColorMode,
  useColorModeValue,
  WrapItem,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useLogoutMutation } from '../graphql/generated/graphql';
import { useRouter } from 'next/router';
import { useUserContext } from '../providers/UserProvider';
import MenuNavLink from './MenuNavLink';
import { RiUserFill } from 'react-icons/ri';
import { BiPowerOff } from 'react-icons/bi';
import { AiFillHome } from 'react-icons/ai';
import MenuNavButton from './MenuNavButton';

const Nav: React.FC = () => {
  const { user, setUser } = useUserContext();
  const { colorMode, toggleColorMode } = useColorMode();

  const modeBgColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
  const menuBgColor = useColorModeValue('white', 'whiteAlpha.300');
  const menuBoxShadowColor = useColorModeValue(
    '-1px 0 10px 1px #ccc',
    '-1px 0 10px 1px #111'
  );

  const router = useRouter();
  const [logOut] = useLogoutMutation({
    onCompleted: () => router.push('/login'),
  });

  const handleLogOut = async () => {
    setUser(null);
    await logOut();
  };

  if (router.pathname === '/login' || router.pathname === '/register') {
    return (
      <IconButton
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
        aria-label={colorMode === 'light' ? 'Light mode' : 'Dark mode'}
        backgroundColor={modeBgColor}
        _focus={{ outline: 'none' }}
        position="fixed"
        m={2}
        right={0}
        top={0}
      />
    );
  }

  return (
    <Box
      as="header"
      top={0}
      left={0}
      width="100%"
      backgroundColor={menuBgColor}
      height="100vh"
      boxShadow={menuBoxShadowColor}
      position="relative"
    >
      <WrapItem
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexFlow="column"
        pt={20}
        pb={20}
      >
        <Avatar name={user?.name} size="xl" mb={4} />
        <Text fontSize={20} fontWeight="700" colorScheme="gray">
          {user?.name}
        </Text>
        <Text fontSize={16} colorScheme="gray">
          @{user?.username}
        </Text>
      </WrapItem>
      <List>
        <MenuNavLink
          href="/"
          name="Home"
          icon={AiFillHome}
          selected={router.pathname === '/'}
        />
        <MenuNavLink
          href="/profile"
          name="Profile"
          icon={RiUserFill}
          selected={router.pathname === '/profile'}
        />
        <MenuNavButton onClick={handleLogOut} name="Logout" icon={BiPowerOff} />
      </List>
      <IconButton
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
        aria-label={colorMode === 'light' ? 'Light mode' : 'Dark mode'}
        backgroundColor={modeBgColor}
        _focus={{ outline: 'none' }}
        position="absolute"
        m={2}
        right={0}
        top={0}
      />
    </Box>
  );
};

export default Nav;
