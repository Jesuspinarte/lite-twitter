import { Flex, useColorModeValue, useToast } from '@chakra-ui/react';
import { ScrollTweets } from 'components/shared/ScrollTweets';
import {
  Tweet,
  TweetCommentsQuery,
  useTweetWithCommentsLazyQuery,
} from 'graphql/generated/graphql';
import React, { useEffect, useState } from 'react';
import TweetBox from '../shared/tweet/TweetBox';
import TweetForm from '../shared/tweet/TweetForm';

export interface TweetDisplayProps {
  comments: Tweet[];
  tweet: Tweet;
  nextSkip: number | null;
  nextTake: number | null;
}
export const TweetDisplay: React.FC<TweetDisplayProps> = ({
  comments: firstComments,
  nextSkip,
  nextTake,
  tweet,
}) => {
  const [comments, setComments] = useState(firstComments);
  const [skip, setSkip] = useState<number | null | undefined>(nextSkip);
  const [take, setTake] = useState<number | null | undefined>(nextTake);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const menuBoxShadowColor = useColorModeValue(
    '-1px 0 10px 1px #ccc',
    '-1px 0 10px 1px #111'
  );

  useEffect(() => {
    setComments(firstComments);
  }, [firstComments]);

  const [queryMoreComments] = useTweetWithCommentsLazyQuery({
    variables: {
      params: { skip, take, tweetId: tweet.id },
    },
  });

  const loadMoreTweets = async () => {
    setIsLoading(true);

    const onCompleted = ({
      tweetComments: { comments, nextSkip, nextTake, errors },
    }: TweetCommentsQuery) => {
      if (!errors) {
        setComments(prevState => [...prevState, ...(comments as Tweet[])]);
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

    await queryMoreComments({
      variables: {
        params: { skip, take, tweetId: tweet.id },
      },
      onCompleted,
    });
  };

  const handleComment = (comment: Tweet) => {
    if (comment) {
      const newComment = { ...comment };
      setComments(prevState => [newComment, ...prevState]);
    }
  };

  return (
    <Flex
      flexFlow="column wrap"
      boxShadow={menuBoxShadowColor}
      borderTopRadius={6}
      overflow="hidden"
      mb={16}
    >
      <TweetBox {...tweet} />
      <TweetForm
        onSubmit={handleComment}
        placeholder="Tweet your reply"
        textBtn="Reply"
        tweetId={tweet.id}
      />
      <ScrollTweets
        tweets={comments}
        next={take === null ? () => {} : loadMoreTweets}
        hasMore={take !== null}
        isLoading={isLoading}
      />
    </Flex>
  );
};
