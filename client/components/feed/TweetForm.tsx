import {
  Box,
  Button,
  Flex,
  Progress,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMemo, useRef, useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import { usePostTweetMutation } from '../../graphql/generated/graphql';

const TweetForm: React.FC = () => {
  const bgColor = useColorModeValue('#dcdcdc', 'whiteAlpha.300');
  const submitBgColor = useColorModeValue('gray.700', 'teal.200');
  const submitTextColor = useColorModeValue('whiteAlpha.900', 'gray.800');
  const submitTextColorPlaceholder = useColorModeValue(
    'blackAlpha.500',
    'whiteAlpha.500'
  );
  const textCounterErrorColor = useColorModeValue('red.400', 'red.300');

  const [textCount, setTextCount] = useState(0);

  const tweetText = useRef<HTMLTextAreaElement>(null);

  const [postTweet] = usePostTweetMutation({
    variables: { tweet: { text: tweetText.current?.value || '' } },
    onCompleted: () => alert('Tweet posted'),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (tweetText.current?.value) {
      await postTweet();
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
        placeholder="What's happening?"
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
        >
          Tweet
        </Button>
      </Flex>
    </Flex>
  );
  Progress;
};

export default TweetForm;
