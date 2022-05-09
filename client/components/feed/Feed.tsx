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

import TweetForm from '../shared/tweet/TweetForm';
import { HiArrowSmUp } from 'react-icons/hi';
import { useUserContext } from 'providers/UserProvider';
import { ScrollTweets } from 'components/shared/ScrollTweets';

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
  const [autoLoadMoreTweets, setAutoLoadMoreTweets] = useState(false);
  const loadMoreTweetsBtnRef = useRef<ToastId | undefined>();
  const [skip, setSkip] = useState<number | null | undefined>(nextSkip);
  const [take, setTake] = useState<number | null | undefined>(nextTake);
  const toast = useToast();
  const { user } = useUserContext();

  const menuBoxShadowColor = useColorModeValue(
    '-1px 0 10px 1px #ccc',
    '-1px 0 10px 1px #111'
  );

  const [queryNewTweets] = useTweetsLazyQuery();

  const loadNewTweets = useCallback(async () => {
    setIsLoadingTop(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (loadMoreTweetsBtnRef.current) {
      toast.close(loadMoreTweetsBtnRef.current);
    }

    await queryNewTweets({
      variables: { ids: newTweetsIds },
      onCompleted: ({ tweets: { errors, tweets } }) => {
        if (!errors) {
          setTweets(prevState => [...(tweets as Tweet[]), ...prevState]);
          setNewTweetsIds([]);
          setAutoLoadMoreTweets(false);
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
  }, [toast, newTweetsIds, queryNewTweets]);

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
    if (newTweetsIds.length && !autoLoadMoreTweets) {
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
  }, [newTweetsIds, toast, loadNewTweets, autoLoadMoreTweets]);

  useEffect(() => {
    if (autoLoadMoreTweets) {
      loadNewTweets();
    }
  }, [autoLoadMoreTweets, loadNewTweets]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      client.subscribe({ query: FeedNotificationsDocument }).subscribe({
        next({
          data: {
            feedNotifications: { errors, tweetId, userId },
          },
        }) {
          if (!errors) {
            setNewTweetsIds(prevState => [tweetId, ...prevState]);

            if (userId === user?.id) {
              setAutoLoadMoreTweets(true);
            }
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
  }, [toast, user]);

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
      <ScrollTweets
        tweets={tweets}
        next={take === null ? () => {} : loadMoreTweets}
        hasMore={take !== null}
        isLoading={isLoading}
      />
    </Flex>
  );
};

export default Feed;
