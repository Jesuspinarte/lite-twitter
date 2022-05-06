import {
  Box,
  Button,
  Flex,
  Spinner,
  ToastId,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FeedNotificationsDocument,
  FeedQuery,
  Tweet,
  useFeedLazyQuery,
  useTweetsLazyQuery,
} from '../../graphql/generated/graphql';
import { client } from '../../pages/_app';
import TweetBox from './TweetBox';

import TweetForm from './TweetForm';
import InfiniteScroll from 'react-infinite-scroll-component';
import { HiArrowSmUp } from 'react-icons/hi';

export interface FeedProps {
  tweets: Tweet[];
  nextSkip: number | null;
  nextTake: number | null;
}
const Feed: React.FC<FeedProps> = ({
  tweets: firstTweets,
  nextSkip,
  nextTake,
}) => {
  const [tweets, setTweets] = useState(firstTweets);
  const [newTweetsIds, setNewTweetsIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTop, setIsLoadingTop] = useState(false);
  const loadMoreTweetsBtnRef = useRef<ToastId | undefined>();
  const [skip, setSkip] = useState<number | null | undefined>(nextSkip);
  const [take, setTake] = useState<number | null | undefined>(nextTake);
  const toast = useToast();

  const menuBoxShadowColor = useColorModeValue(
    '-1px 0 10px 1px #ccc',
    '-1px 0 10px 1px #111'
  );

  const [queryNewTwetts] = useTweetsLazyQuery();

  const loadNewTweets = useCallback(async () => {
    setIsLoadingTop(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (loadMoreTweetsBtnRef.current) {
      toast.close(loadMoreTweetsBtnRef.current);
    }

    await queryNewTwetts({
      variables: { ids: newTweetsIds },
      onCompleted: ({ tweets: { errors, tweets } }) => {
        if (!errors) {
          setTweets(prevState => [...(tweets as Tweet[]), ...prevState]);
        } else {
          toast({
            title: errors[0].field || errors[0].type || 'Unexpected error.',
            description: errors[0].message || 'Something went wrong.',
            position: 'bottom',
            isClosable: true,
            status: 'error',
          });
        }
        setIsLoadingTop(false);
      },
    });
  }, [toast, newTweetsIds, queryNewTwetts]);

  const [queryMoreTweets] = useFeedLazyQuery({
    variables: {
      params: { skip, take },
    },
  });

  const loadMoreTweets = async () => {
    setIsLoading(true);

    const onCompleted = ({
      feed: { tweets, nextSkip, nextTake, errors },
    }: FeedQuery) => {
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
    };

    await queryMoreTweets({
      variables: {
        params: { skip, take },
      },
      onCompleted,
    });
  };

  useEffect(() => {
    if (newTweetsIds.length) {
      loadMoreTweetsBtnRef.current = toast({
        position: 'top',
        duration: null,
        render: () => (
          <Box>
            <Button
              leftIcon={<HiArrowSmUp />}
              onClick={loadNewTweets}
              colorScheme="teal"
            >
              See new tweets
            </Button>
          </Box>
        ),
      });
    }
  }, [newTweetsIds, toast, loadNewTweets]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      client.subscribe({ query: FeedNotificationsDocument }).subscribe({
        next({
          data: {
            feedNotifications: { errors, tweetId },
          },
        }) {
          if (!errors) {
            setNewTweetsIds(prevState => [tweetId, ...prevState]);
          } else {
            toast({
              title: errors[0].field || errors[0].type || 'Unexpected error.',
              description: errors[0].message || 'Something went wrong.',
              position: 'bottom',
              isClosable: true,
              status: 'error',
            });
          }
        },
        error(err) {
          console.warn('error', err);
        },
      });
    }
  }, [toast]);

  return (
    <Flex
      flexFlow="column wrap"
      boxShadow={menuBoxShadowColor}
      borderTopRadius={6}
      overflow="hidden"
      mb={16}
    >
      <TweetForm />
      {isLoadingTop && (
        <Flex justifyContent="center" alignItems="center" width="100%" p={4}>
          <Spinner size="lg" />
        </Flex>
      )}
      <Box>
        <InfiniteScroll
          dataLength={tweets.length}
          next={take === null ? () => {} : loadMoreTweets}
          hasMore={take !== null}
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
    </Flex>
  );
};

export default Feed;
