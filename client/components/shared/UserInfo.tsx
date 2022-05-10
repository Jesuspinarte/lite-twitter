import { Avatar, Box, Text, WrapItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
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
}) => {
  const router = useRouter();

  const redirectToUserProfile = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    event.stopPropagation();
    router.push(`/${username}`);
  };

  return (
    <WrapItem
      as="div"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      flexFlow="row"
      pt={pt}
      pb={pb}
      mb={mb}
      onClick={redirectToUserProfile}
      cursor='pointer'
      _hover={{ 'p': { textDecoration: 'underline' } }}
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
};

export default UserInfo;
