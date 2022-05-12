import {
  Box,
  Button,
  Flex,
  FormLabel,
  IconButton,
  Image,
  Input,
  InputGroup,
  Progress,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VisuallyHidden,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import {
  Tweet,
  UploadImageDocument,
  usePostTweetMutation,
  useUploadImageMutation,
} from '../../../graphql/generated/graphql';
import { IoMdImage, IoMdTrash } from 'react-icons/io';
import { useMutation } from '@apollo/client';

interface TweetFormProps {
  onSubmit?: (tweet: Tweet) => void;
  placeholder?: string;
  textBtn?: string;
  tweetId?: string;
}

const TweetForm: React.FC<TweetFormProps> = ({
  onSubmit,
  placeholder,
  textBtn,
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
  const [image, setImage] = useState<File>();
  const [displayImage, setDisplayImage] = useState<string>();
  const toast = useToast();

  const tweetText = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

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
      const tweetResponse = await postTweet();
      if (onSubmit && tweetResponse.data?.postTweet.tweet) {
        onSubmit(tweetResponse.data?.postTweet.tweet as Tweet);
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

  const [uploadImage] = useMutation(UploadImageDocument);

  useEffect(() => {
    const mutate = async () => {
      const b = await image?.arrayBuffer();
      // console.log(getBase);

      if (image) {
        const a = await uploadImage({
          variables: { file: image },
          // variables: { file: { image: URL.createObjectURL(file) } },
          context: {
            useMultipart: true,
          },
        });
        console.log(a);
      }
    };

    mutate();
  }, [image, uploadImage]);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];

    if (file && file.name.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)) {
      setImage(file);
      setDisplayImage(URL.createObjectURL(file));
    } else {
      setImage(undefined);
      setDisplayImage(undefined);
    }
  };

  const removeImage = () => {
    setImage(undefined);
    setDisplayImage(undefined);

    if (fileInput.current?.value) {
      fileInput.current.value = '';
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
      {displayImage && (
        <Flex
          padding={4}
          justifyContent="center"
          alignItems="center"
          maxW="100%"
          position="relative"
        >
          <Image
            maxW="80%"
            src={displayImage}
            alt="Image to upload"
            fallbackSrc="https://via.placeholder.com/850"
            borderRadius={16}
          />
          <Box
            position="absolute"
            top={6}
            left="14%"
            bgColor="blackAlpha.800"
            borderRadius={20}
          >
            <IconButton
              icon={<IoMdTrash />}
              aria-label="Remove image"
              variant="ghost"
              size="lg"
              isRound
              colorScheme="red"
              h={8}
              w={8}
              minW={8}
              onClick={removeImage}
              // _focus={{ outline: 'none', bgColor: 'transparent' }}
            />
          </Box>
        </Flex>
      )}
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
        <InputGroup width={12} mr={4}>
          <VisuallyHidden>
            <FormLabel>Upload file</FormLabel>
            <Input
              type="file"
              ref={fileInput}
              onChange={onFileChange}
              accept="image/*"
            />
          </VisuallyHidden>
          <IconButton
            icon={<IoMdImage />}
            aria-label="Upload image"
            variant="ghost"
            size="lg"
            isRound
            colorScheme="teal"
            h={8}
            w={8}
            minW={8}
            mr={2}
            onClick={() => fileInput.current?.click()}
            _focus={{ outline: 'none', bgColor: 'transparent' }}
          />
        </InputGroup>
        <Button
          type="submit"
          backgroundColor={submitBgColor}
          color={submitTextColor}
          pr={10}
          pl={10}
          isLoading={isLoading}
        >
          {textBtn || 'Tweet'}
        </Button>
      </Flex>
    </Flex>
  );
  Progress;
};

export default TweetForm;
