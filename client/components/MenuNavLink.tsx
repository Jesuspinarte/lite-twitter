import NextLink from 'next/link';
import { As, Link, ListIcon, ListItem } from '@chakra-ui/react';

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
  return (
    <NextLink href={href} passHref>
      <Link _focus={{ outline: 'none' }}>
        <ListItem cursor="pointer" _focus={{ outline: 'none' }}>
          <ListIcon as={icon} _focus={{ outline: 'none' }} />
          {name}
        </ListItem>
      </Link>
    </NextLink>
  );
};

export default MenuNavLink;
