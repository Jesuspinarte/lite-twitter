import NextLink from 'next/link';
import {
  As,
  Box,
  Link,
  ListIcon,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';

interface MenuNavLinkProps {
  href: string;
  name: string;
  icon: As<any>;
  selected?: boolean;
}

const MenuNavLink: React.FC<MenuNavLinkProps> = ({
  href,
  name,
  icon,
  selected = false,
}) => {
  const menuColor = useColorModeValue('gray.500', 'white');
  const hoverColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <NextLink href={href} passHref>
      <Link _focus={{ outline: 'none' }} _hover={{ textDecoration: 'none' }}>
        <ListItem
          cursor="pointer"
          _focus={{ outline: 'none' }}
          p={2}
          position="relative"
          color={menuColor}
          _hover={{ backgroundColor: hoverColor, textDecoration: 'none' }}
        >
          {selected && (
            <Box
              as="span"
              height="100%"
              width="4px"
              backgroundColor={menuColor}
              position="absolute"
              top={0}
              left="-1rem"
            />
          )}
          <ListIcon as={icon} _focus={{ outline: 'none' }} color={menuColor} />
          {name}
        </ListItem>
      </Link>
    </NextLink>
  );
};

export default MenuNavLink;
