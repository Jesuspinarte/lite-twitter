import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { Tweet } from '../../graphql/generated/graphql';
import TweetBox from './TweetBox';

import TweetForm from './TweetForm';

interface FeedProps {
  tweets: Tweet[];
}

const Feed: React.FC<FeedProps> = ({ tweets }) => {
  const menuBoxShadowColor = useColorModeValue(
    '-1px 0 10px 1px #ccc',
    '-1px 0 10px 1px #111'
  );

  return (
    <Flex flexFlow="column wrap" boxShadow={menuBoxShadowColor} borderTopRadius={6}>
      <TweetForm />
      <Box>
        {tweets.map(tweet => (
          <TweetBox key={tweet.id} {...tweet} />
        ))}
      </Box>
    </Flex>
  );
};

export default Feed;
