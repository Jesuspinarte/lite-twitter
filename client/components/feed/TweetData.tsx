import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React, { Fragment, useMemo } from 'react';
import { Tweet } from '../../graphql/generated/graphql';
import timeAgo from '../../utils/timeAgo';
import UserInfo from '../shared/UserInfo';

const TweetData: React.FC<Tweet> = ({
  text,
  createdAt,
  user: { name, username },
}) => {
  const textColor = useColorModeValue('gray.600', 'whiteAlpha.800');
  const textDateColor = useColorModeValue('blackAlpha.500', 'whiteAlpha.500');
  const textMentionColor = useColorModeValue('teal.400', 'teal.200');

  const postedAt = useMemo(
    () => timeAgo.format(new Date(createdAt), 'twitter-minute'),
    [createdAt]
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

  return (
    <>
      <Flex justifyContent="space-between">
        <UserInfo name={name} username={username} pt={0} pb={0} mb={4} />
        <Text color={textDateColor}>{postedAt}</Text>
      </Flex>
      <Text ml={16} color={textColor}>
        {bodyText}
      </Text>
    </>
  );
};

export default TweetData;
