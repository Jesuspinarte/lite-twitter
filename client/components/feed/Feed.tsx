import { useSubscription } from '@apollo/client';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { useEffect } from 'react';
import {
  FeedNotificationsDocument,
  Tweet,
  useFeedNotificationsSubscription,
} from '../../graphql/generated/graphql';
import { client } from '../../pages/_app';
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      client.subscribe({ query: FeedNotificationsDocument }).subscribe({
        next({
          data: {
            feedNotifications: { errors, tweetId },
          },
        }) {
          console.log('data', errors, tweetId);
        },
        complete() {
          console.log('complete');
        },
        error(err) {
          console.warn('error', err);
        },
      });
    }
  }, []);

  return (
    <Flex
      flexFlow="column wrap"
      boxShadow={menuBoxShadowColor}
      borderTopRadius={6}
    >
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
