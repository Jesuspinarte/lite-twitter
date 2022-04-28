import NextLink from 'next/link';
import { As, Link, ListIcon, ListItem } from '@chakra-ui/react';

interface MenuNavButtonProps {
  onClick: () => void;
  name?: string;
  icon: As<any>;
  fontSize?: string;
  backgroundColor?: string;
  padding?: string;
}

const MenuNavButton: React.FC<MenuNavButtonProps> = ({
  onClick,
  name,
  icon,
  fontSize = '16px',
  backgroundColor = 'transparent',
  padding = '0px',
}) => {
  return (
    <ListItem
      onClick={onClick}
      fontSize={fontSize}
      backgroundColor={backgroundColor}
      padding={padding}
    >
      <ListIcon as={icon} />
    </ListItem>
  );
};

export default MenuNavButton;
