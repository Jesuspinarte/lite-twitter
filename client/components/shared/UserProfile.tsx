import { Avatar, Box, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface UserProfileProps {
  name: string;
  username: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, username }) => {
  const avatarBorder = useColorModeValue('#eee', 'gray.800');
  const boxShadow = useColorModeValue(
    '-1px 0 10px 1px #ccc',
    '-1px 0 10px 1px #111'
  );

  return (
    <Box boxShadow={boxShadow}>
      <Box bgColor="teal" w="100%" h={40} borderTopRadius={6} pos="relative">
        <Avatar
          name={name}
          size="2xl"
          mr={4}
          borderWidth={4}
          borderStyle="solid"
          borderColor={avatarBorder}
          boxSizing="content-box"
          pos="absolute"
          left={4}
          bottom={0}
          transform="translateY(50%)"
        />
      </Box>
      <Box mt={20} ml={4} pb={8}>
        <Text fontSize={16} fontWeight="700" colorScheme="gray">
          {name}
        </Text>
        <Text fontSize={14} fontWeight="400" colorScheme="gray" opacity={0.7}>
          @{username}
        </Text>
      </Box>
    </Box>
  );
};

export default UserProfile;
