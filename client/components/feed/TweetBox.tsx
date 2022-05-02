import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React, { Fragment, useMemo } from 'react';
import { Tweet } from '../../graphql/generated/graphql';
import timeAgo from '../../utils/timeAgo';
import UserInfo from '../shared/UserInfo';
import TweetInteractions from './TweetInteractions';

const TweetBox: React.FC<Tweet> = ({
  commentsCount,
  id,
  text,
  createdAt,
  hasVote,
  user: { name, username },
  votesCount,
  tweet,
}) => {
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
        <Box backgroundColor={bgColor} p={8} pos="relative">
          <Flex justifyContent="space-between">
            <UserInfo
              name={tweet.user.name}
              username={tweet.user.username}
              pt={0}
              pb={0}
              mb={4}
            />
            <Text color={textDateColor}>{repliedPostedAt}</Text>
          </Flex>
          <Text ml={16} color={textColor}>
            {repliedBodyText}
          </Text>
          <TweetInteractions id={tweet.id} hasVote={tweet.hasVote} />
          <Box
            pos="absolute"
            h="100%"
            w="2px"
            bgColor={replyBgColor}
            top={20}
            left="54px"
          />
        </Box>
        <Box backgroundColor={bgColor} p={8}>
          <Flex justifyContent="space-between">
            <UserInfo name={name} username={username} pt={0} pb={0} mb={4} />
            <Text color={textDateColor}>{postedAt}</Text>
          </Flex>
          <Text ml={16} color={textColor}>
            {bodyText}
          </Text>
          <TweetInteractions id={id} hasVote={hasVote} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      backgroundColor={bgColor}
      p={4}
      borderBottom={borderColor}
      _last={{ borderBottomRadius: 6, borderBottom: 0 }}
    >
      <Flex justifyContent="space-between">
        <UserInfo name={name} username={username} pt={0} pb={0} mb={4} />
        <Text color={textDateColor}>{postedAt}</Text>
      </Flex>
      <Text ml={16} color={textColor}>
        {bodyText}
      </Text>
      <TweetInteractions id={id} hasVote={hasVote} />
    </Box>
  );
};

export default TweetBox;
