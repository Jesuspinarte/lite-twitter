import {
  Box,
  Button,
  Flex,
  Progress,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import { usePostTweetMutation } from '../../graphql/generated/graphql';

interface TweetFormProps {
  onSubmit?: () => void;
  placeholder?: string;
  tweetId?: string;
}

const TweetForm: React.FC<TweetFormProps> = ({
  onSubmit,
  placeholder,
  tweetId,
}) => {
  const bgColor = useColorModeValue('#dcdcdc', 'whiteAlpha.300');
  const submitBgColor = useColorModeValue('gray.700', 'teal.200');
  const submitTextColor = useColorModeValue('whiteAlpha.900', 'gray.800');
  const submitTextColorPlaceholder = useColorModeValue(
    'blackAlpha.500',
    'whiteAlpha.500'
  );
  const textCounterErrorColor = useColorModeValue('red.400', 'red.300');

  const [textCount, setTextCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const tweetText = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (tweetText.current) {
      tweetText.current.focus();
    }
  }, []);

  const [postTweet] = usePostTweetMutation({
    variables: {
      tweet: {
        text: tweetText.current?.value || '',
        ...(tweetId && { tweetId }),
      },
    },
    onCompleted: ({ postTweet }) => {
      if (!postTweet.errors) {
        toast({
          title: 'Tweet published!',
          position: 'bottom',
          isClosable: true,
          status: 'success',
        });

        if (tweetText.current) {
          tweetText.current.value = '';
          setTextCount(0);
        }
      } else {
        toast({
          title: 'There was an unexpected error.',
          position: 'bottom',
          isClosable: true,
          status: 'error',
        });
      }
    },
  });

  const handleSubmit = async (event?: React.FormEvent<HTMLDivElement>) => {
    event?.preventDefault();

    if (tweetText.current?.value) {
      setIsLoading(true);
      await postTweet();
      if (onSubmit) {
        onSubmit();
      }
      setIsLoading(false);
    }
  };

  const handleCtrlEnter = async (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.ctrlKey && event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Flex
      as="form"
      w="100%"
      maxW="100%"
      m={0}
      p={4}
      pt={8}
      backgroundColor={bgColor}
      borderTopRadius={6}
      textAlign="right"
      onSubmit={handleSubmit}
      onKeyDown={handleCtrlEnter}
      flexFlow="column wrap"
    >
      <Textarea
        minH="unset"
        overflow="hidden"
        resize="none"
        minRows={1}
        as={ResizeTextarea}
        border={0}
        borderBottom="1px solid #bbb"
        borderRadius={0}
        backgroundColor="transparent"
        mb={2}
        maxLength={280}
        placeholder={placeholder || "What's happening?"}
        pt={4}
        pb={8}
        ref={tweetText}
        onChange={e => setTextCount(e.target.value.length || 0)}
        _focus={{ outline: 0, borderBottom: '1px solid #777' }}
        _placeholder={{ color: submitTextColorPlaceholder }}
      />
      <Flex justifyContent="center" alignItems="center">
        <Box width="100%" mr={4}>
          <Progress
            value={textCount}
            max={280}
            min={0}
            size="xs"
            colorScheme={textCount === 280 ? 'red' : 'teal'}
            width="100%"
          />
          {textCount === 280 && (
            <Text color={textCounterErrorColor}>
              <strong>Limit reached.</strong> No more than 280 characters are
              allowed per tweet.
            </Text>
          )}
        </Box>
        <Button
          type="submit"
          backgroundColor={submitBgColor}
          color={submitTextColor}
          pr={10}
          pl={10}
          isLoading={isLoading}
        >
          Tweet
        </Button>
      </Flex>
    </Flex>
  );
  Progress;
};

export default TweetForm;
