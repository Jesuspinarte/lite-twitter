import {
  Avatar,
  Box,
  IconButton,
  List,
  Text,
  useColorMode,
  useColorModeValue,
  WrapItem,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useLogoutMutation } from '../../graphql/generated/graphql';
import { useRouter } from 'next/router';
import { useUserContext } from '../../providers/UserProvider';
import MenuNavLink from './MenuNavLink';
import MenuNavButton from './MenuNavButton';

import { RiUserFill } from 'react-icons/ri';
import { BiPowerOff } from 'react-icons/bi';
import { AiFillHome } from 'react-icons/ai';
import UserInfo from '../shared/UserInfo';

const Nav: React.FC = () => {
  const { user, setUser } = useUserContext();
  const { colorMode, toggleColorMode } = useColorMode();

  const modeBgColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
  const menuBgColor = useColorModeValue('white', 'whiteAlpha.100');
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

  if (
    !user ||
    router.pathname === '/login' ||
    router.pathname === '/register'
  ) {
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
      boxShadow={menuBoxShadowColor}
      position="relative"
      p={4}
      pb={14}
      borderRadius={6}
    >
      <List>
        <UserInfo
          name={user.name}
          nameFontSize={18}
          size="lg"
          username={user.username}
          usernameFontSize={16}
        />
        <MenuNavLink
          href="/"
          name="Home"
          icon={AiFillHome}
          selected={router.pathname === '/'}
        />
        <MenuNavLink
          href="/activity"
          name="Activity"
          icon={RiUserFill}
          selected={router.pathname === '/activity'}
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
