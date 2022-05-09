import { Avatar, Box, Text, WrapItem } from '@chakra-ui/react';
import React from 'react';

interface UserInfoProps {
  name: string;
  nameFontSize?: number;
  size?: string;
  username: string;
  usernameFontSize?: number;
  pt?: number;
  pb?: number;
  mb?: number;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  size,
  username,
  nameFontSize = 16,
  usernameFontSize = 14,
  pt = 12,
  pb = 12,
  mb = 4,
}) => (
  <WrapItem
    as="div"
    display="flex"
    alignItems="center"
    justifyContent="flex-start"
    flexFlow="row"
    pt={pt}
    pb={pb}
    mb={mb}
  >
    <Avatar name={name} size={size} mr={4} />
    <Box>
      <Text fontSize={nameFontSize} fontWeight="700" colorScheme="gray">
        {name}
      </Text>
      <Text
        fontSize={usernameFontSize}
        fontWeight="400"
        colorScheme="gray"
        opacity={0.7}
      >
        @{username}
      </Text>
    </Box>
  </WrapItem>
);

export default UserInfo;
