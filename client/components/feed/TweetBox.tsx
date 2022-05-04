import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React, { Fragment, useMemo } from 'react';
import { Tweet } from '../../graphql/generated/graphql';
import timeAgo from '../../utils/timeAgo';
import UserInfo from '../shared/UserInfo';
import TweetData from './TweetData';
import TweetInteractions from './TweetInteractions';

const TweetBox: React.FC<Tweet> = props => {
  const {
    text,
    createdAt,
    user: { name, username },
    tweet,
  } = props;

  const bgColor = useColorModeValue('white', 'whiteAlpha.100');
  const replyBgColor = useColorModeValue('#ddd', '#444');
  const borderColor = useColorModeValue('1px solid #ddd', '1px solid #444');
  const textColor = useColorModeValue('gray.600', 'whiteAlpha.800');
  const textDateColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500');
  const textMentionColor = useColorModeValue('teal.400', 'teal.200');

  const postedAt = useMemo(
    () => timeAgo.format(new Date(createdAt), 'twitter-minute'),
    [createdAt]
  );

  const repliedPostedAt = useMemo(
    () =>
      tweet
        ? timeAgo.format(new Date(tweet.createdAt), 'twitter-minute')
        : null,
    [tweet]
  );

  const bodyText = useMemo(
    () =>
      text.split(/([\#|\@]\w\w+\s?)/g).map((t, i) =>
        t.match(/[\#|\@]\w\w+\s?/g) ? (
          <Text key={i} as="a" color={textMentionColor} fontWeight="500">
            {t}
          </Text>
        ) : (
          <Fragment key={i}>{t}</Fragment>
        )
      ),
    [text, textMentionColor]
  );

  const repliedBodyText = useMemo(
    () =>
      tweet
        ? tweet.text.split(/([\#|\@]\w\w+\s?)/g).map((t, i) =>
            t.match(/[\#|\@]\w\w+\s?/g) ? (
              <Text key={i} as="a" color={textMentionColor} fontWeight="500">
                {t}
              </Text>
            ) : (
              <Fragment key={i}>{t}</Fragment>
            )
          )
        : null,
    [tweet, textMentionColor]
  );

  if (tweet) {
    return (
      <Box
        borderBottom={borderColor}
        _last={{ borderBottomRadius: 6, borderBottom: 0 }}
        pos="relative"
      >
        <Box backgroundColor={bgColor} p={8} pb={4} pos="relative">
          <TweetData {...tweet} />
          <TweetInteractions {...tweet} />
          <Box
            pos="absolute"
            h="100%"
            w="2px"
            bgColor={replyBgColor}
            top={20}
            left="54px"
          />
        </Box>
        <Box backgroundColor={bgColor} p={8} pb={4}>
          <TweetData {...props} />
          <TweetInteractions {...props} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      backgroundColor={bgColor}
      p={8}
      pb={4}
      borderBottom={borderColor}
      _last={{ borderBottomRadius: 6, borderBottom: 0 }}
    >
      <TweetData {...props} />
      <TweetInteractions {...props} />
    </Box>
  );
};

export default TweetBox;
