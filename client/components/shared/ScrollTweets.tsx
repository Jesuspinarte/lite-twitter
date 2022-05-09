import { Box, Flex, Spinner } from '@chakra-ui/react';
import TweetBox from 'components/shared/tweet/TweetBox';
import { Tweet } from 'graphql/generated/graphql';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface ScrollTweetsProps {
  hasMore: boolean;
  next: () => void;
  tweets: Tweet[];
  isLoading?: boolean;
}

export const ScrollTweets: React.FC<ScrollTweetsProps> = ({
  hasMore,
  isLoading = false,
  next,
  tweets,
}) => {
  return (
    <Box>
      <InfiniteScroll
        dataLength={tweets.length}
        next={next}
        hasMore={hasMore}
        loader={null}
      >
        {tweets.map(tweet => (
          <TweetBox key={tweet.id} {...tweet} />
        ))}
      </InfiniteScroll>
      {isLoading && (
        <Flex justifyContent="center" alignItems="center" width="100%" p={4}>
          <Spinner size="lg" />
        </Flex>
      )}
    </Box>
  );
};
