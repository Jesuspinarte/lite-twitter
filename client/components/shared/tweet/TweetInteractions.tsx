import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { MdOutlineModeComment } from 'react-icons/md';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

import {
  Tweet,
  useUnvoteMutation,
  useVoteMutation,
} from '../../../graphql/generated/graphql';
import { useState } from 'react';
import TweetForm from './TweetForm';
import TweetData from './TweetData';

const TweetInteractions: React.FC<Tweet> = props => {
  const {
    id,
    hasVote,
    votesCount: tweetVotes,
    commentsCount: tweetComments,
  } = props;

  const [hasVoted, setHasVoted] = useState(hasVote);
  const [isLoadingVote, setIsLoadingVote] = useState(false);

  const [votesCount, setVotesCount] = useState(tweetVotes);
  const [commentsCount, setCommentsCount] = useState(tweetComments);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [voteForTweet] = useVoteMutation({
    variables: { tweetId: id },
    onCompleted: ({ vote: { errors, vote } }) => {
      if (!errors) {
        toast({
          title: 'Tweet voted!',
          position: 'bottom',
          isClosable: true,
          status: 'success',
          duration: 1000,
        });
        setHasVoted(true);

        if (vote) {
          setCommentsCount(vote.tweet.commentsCount);
          setVotesCount(vote.tweet.votesCount);
        }
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
    onCompleted: ({ unvote: { errors, vote } }) => {
      if (!errors) {
        toast({
          title: 'Tweet unvoted!',
          position: 'bottom',
          isClosable: true,
          status: 'info',
          duration: 1000,
        });
        setHasVoted(false);

        if (vote) {
          setCommentsCount(vote.tweet.commentsCount);
          setVotesCount(vote.tweet.votesCount);
        }
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

  const handleComment = ({ tweet }: Tweet) => {
    if (tweet?.commentsCount !== undefined) {
      setCommentsCount(tweet?.commentsCount);
    }
    onClose();
  };

  return (
    <Box display="flex" justifyContent="space-around" mt={4} fontSize={22}>
      <Button
        fontSize={11}
        colorScheme="teal"
        variant="ghost"
        _focus={{ outline: 'none', bgColor: 'transparent' }}
        _hover={{ bgColor: 'transparent' }}
        _active={{ bgColor: 'transparent' }}
        as="div"
        onClick={onOpen}
      >
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
          mr={2}
          _focus={{ outline: 'none' }}
          onClick={e => {
            e.stopPropagation();
            onOpen();
          }}
        />
        {commentsCount}
      </Button>
      {hasVoted ? (
        <Button
          fontSize={11}
          colorScheme="red"
          variant="ghost"
          _focus={{ outline: 'none' }}
          _hover={{ bgColor: 'transparent' }}
          _active={{ bgColor: 'transparent' }}
          as="div"
          isLoading={isLoadingVote}
          onClick={async e => {
            e.stopPropagation();
            setIsLoadingVote(true);
            await unvoteForTweet();
            setIsLoadingVote(false);
          }}
        >
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
            mr={2}
            _focus={{ outline: 'none', bgColor: 'transparent' }}
            disabled={isLoadingVote}
          />
          {votesCount}
        </Button>
      ) : (
        <Button
          fontSize={11}
          colorScheme="red"
          variant="ghost"
          _focus={{ outline: 'none', bgColor: 'transparent' }}
          _hover={{ bgColor: 'transparent' }}
          _active={{ bgColor: 'transparent' }}
          as="div"
          isLoading={isLoadingVote}
          onClick={async e => {
            e.stopPropagation();
            setIsLoadingVote(true);
            await voteForTweet();
            setIsLoadingVote(false);
          }}
        >
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
            mr={2}
            _focus={{ outline: 'none' }}
            disabled={isLoadingVote}
          />
          {votesCount}
        </Button>
      )}
      <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
        <ModalOverlay />
        <ModalContent borderRadius={6} overflow="hidden">
          <ModalCloseButton />
          <ModalBody pr={0} pl={0} pt={8} pb={0}>
            <Box p={4} pb={8}>
              <TweetData {...props} />
            </Box>
            <TweetForm
              onSubmit={handleComment}
              placeholder="Tweet your reply"
              textBtn="Reply"
              tweetId={id}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TweetInteractions;
