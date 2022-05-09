import { Box, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Tweet } from '../../../graphql/generated/graphql';
import TweetData from './TweetData';
import TweetInteractions from './TweetInteractions';

const TweetBox: React.FC<Tweet> = props => {
  const { tweet } = props;

  const bgColor = useColorModeValue('white', 'whiteAlpha.100');
  const bgColorHover = useColorModeValue('whiteAlpha.400', 'blackAlpha.50');
  const replyBgColor = useColorModeValue('#ddd', '#444');
  const borderColor = useColorModeValue('1px solid #ddd', '1px solid #444');

  const router = useRouter();

  const goToTweet = (id: string) => router.push(`/tweets/${id}`);

  if (tweet) {
    return (
      <Box
        borderBottom={borderColor}
        _last={{ borderBottomRadius: 6, borderBottom: 0 }}
        pos="relative"
      >
        <Box
          backgroundColor={bgColor}
          p={8}
          pb={4}
          pos="relative"
          cursor="pointer"
          onClick={() => goToTweet(tweet.id)}
          _hover={{ bgColor: bgColorHover }}
        >
          <TweetData {...tweet} />
          <TweetInteractions {...tweet} />
          <Box
            pos="absolute"
            h="100%"
            w="2px"
            bgColor={replyBgColor}
            top={20}
            left="54px"
          />
        </Box>
        <Box
          backgroundColor={bgColor}
          p={8}
          pb={4}
          cursor="pointer"
          onClick={() => goToTweet(props.id)}
          _hover={{ bgColor: bgColorHover }}
        >
          <TweetData {...props} />
          <TweetInteractions {...props} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      backgroundColor={bgColor}
      p={8}
      pb={4}
      borderBottom={borderColor}
      cursor="pointer"
      onClick={() => goToTweet(props.id)}
      _hover={{ bgColor: bgColorHover }}
      _last={{ borderBottomRadius: 6, borderBottom: 0 }}
    >
      <TweetData {...props} />
      <TweetInteractions {...props} />
    </Box>
  );
};

export default TweetBox;
