import {
  As,
  Box,
  ListIcon,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';

interface MenuNavButtonProps {
  onClick: () => void;
  name?: string;
  icon: As<any>;
  selected?: boolean;
}

const MenuNavButton: React.FC<MenuNavButtonProps> = ({
  onClick,
  name,
  icon,
  selected = false,
}) => {
  const menuColor = useColorModeValue('gray.500', 'white');

  return (
    <ListItem
      onClick={onClick}
      p={2}
      position="relative"
      color={menuColor}
      cursor="pointer"
      _hover={{ backgroundColor: 'blackAlpha.200' }}
    >
      {selected && (
        <Box
          _before={{
            height: '100%',
            width: '2px',
            background: 'blackAlpha.300',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}
      <ListIcon as={icon} color={menuColor} />
      {name}
    </ListItem>
  );
};

export default MenuNavButton;
