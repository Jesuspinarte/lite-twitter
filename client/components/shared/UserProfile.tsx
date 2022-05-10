import {
  Avatar,
  Box,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  Tweet,
  UserTweetsDocument,
  useUserTweetsLazyQuery,
} from 'graphql/generated/graphql';
import { client } from 'pages/_app';
import React, { useEffect, useState } from 'react';
import { ScrollTweets } from './ScrollTweets';

export interface UserProfileProps {
  name: string;
  username: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, username }) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [skip, setSkip] = useState<number | null | undefined>(0);
  const [take, setTake] = useState<number | null | undefined>(10);

  const toast = useToast();

  const avatarBorder = useColorModeValue('#eee', 'gray.800');
  const boxShadow = useColorModeValue(
    '-1px 0 10px 1px #ccc',
    '-1px 0 10px 1px #111'
  );

  const [queryMoreTweets] = useUserTweetsLazyQuery({
    variables: { params: { skip, take, username } },
  });

  const loadMoreTweets = async () => {
    setIsLoading(true);

    await queryMoreTweets({
      variables: {
        params: { skip, take, username },
      },
      onCompleted: ({ userTweets: { errors, tweets, nextSkip, nextTake } }) => {
        if (!errors) {
          setTweets(prevState => [...prevState, ...(tweets as Tweet[])]);
          setSkip(nextSkip);
          setTake(nextTake);
        } else {
          toast({
            title: errors[0].field || errors[0].type || 'Unexpected error.',
            description: errors[0].message || 'Something went wrong.',
            position: 'bottom',
            isClosable: true,
            status: 'error',
          });
        }

        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const { data } = await client.query({
        query: UserTweetsDocument,
        variables: {
          params: { skip: 0, take: 10, username },
        },
      });

      if (data?.userTweets) {
        const { errors, tweets, nextSkip, nextTake } = data?.userTweets;

        if (!errors) {
          setTweets(tweets as Tweet[]);
          setSkip(nextSkip);
          setTake(nextTake);
        } else {
          toast({
            title: errors[0].field || errors[0].type || 'Unexpected error.',
            description: errors[0].message || 'Something went wrong.',
            position: 'bottom',
            isClosable: true,
            status: 'error',
          });
        }

        setIsLoading(false);
      }
    };

    fetchData();
  }, [username, toast]);

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
      <ScrollTweets
        tweets={tweets}
        next={take === null ? () => {} : loadMoreTweets}
        hasMore={take !== null}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default UserProfile;
