import { Box, IconButton, useToast } from '@chakra-ui/react';

import { MdOutlineModeComment } from 'react-icons/md';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

import {
  Tweet,
  useUnvoteMutation,
  useVoteMutation,
} from '../../graphql/generated/graphql';
import { useState } from 'react';

interface TweetInteractionsProps {
  id: string;
  hasVote: boolean;
}

const TweetInteractions: React.FC<TweetInteractionsProps> = ({
  id,
  hasVote,
}) => {
  const [hasVoted, setHasVoted] = useState(hasVote);
  const [isLoadingVote, setIsLoadingVote] = useState(false);
  const toast = useToast();

  const [voteForTweet] = useVoteMutation({
    variables: { tweetId: id },
    onCompleted: ({ vote }) => {
      if (!vote.errors) {
        toast({
          title: 'Tweet voted!',
          position: 'bottom',
          isClosable: true,
          status: 'success',
        });
        setHasVoted(true);
      } else {
        toast({
          title: 'There was an unexpected error',
          position: 'bottom',
          isClosable: true,
          status: 'error',
        });
      }
    },
  });

  const [unvoteForTweet] = useUnvoteMutation({
    variables: { tweetId: id },
    onCompleted: ({ unvote }) => {
      if (!unvote.errors) {
        toast({
          title: 'Tweet unvoted!',
          position: 'bottom',
          isClosable: true,
          status: 'info',
        });
        setHasVoted(false);
      } else {
        toast({
          title: 'There was an unexpected error',
          position: 'bottom',
          isClosable: true,
          status: 'error',
        });
      }
    },
  });

  return (
    <Box display="flex" justifyContent="space-around" mt={4} fontSize={22}>
      <IconButton
        aria-label="comment"
        icon={<MdOutlineModeComment />}
        variant="ghost"
        size="lg"
        isRound
        colorScheme="teal"
        h={8}
        w={8}
        minW={8}
        _focus={{ outline: 'none' }}
      />
      {hasVoted ? (
        <IconButton
          aria-label="vote"
          icon={<IoMdHeart />}
          variant="ghost"
          size="lg"
          isRound
          colorScheme="red"
          h={8}
          w={8}
          minW={8}
          _focus={{ outline: 'none' }}
          isLoading={isLoadingVote}
          onClick={async () => {
            setIsLoadingVote(true);
            await unvoteForTweet();
            setIsLoadingVote(false);
          }}
        />
      ) : (
        <IconButton
          aria-label="vote"
          icon={<IoMdHeartEmpty />}
          variant="ghost"
          size="lg"
          isRound
          colorScheme="red"
          h={8}
          w={8}
          minW={8}
          isLoading={isLoadingVote}
          _focus={{ outline: 'none' }}
          onClick={async () => {
            setIsLoadingVote(true);
            await voteForTweet();
            setIsLoadingVote(false);
          }}
        />
      )}
    </Box>
  );
};

export default TweetInteractions;
