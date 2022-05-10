import { Box, Flex, Heading } from '@chakra-ui/react';
import UserProfile, { UserProfileProps } from 'components/shared/UserProfile';
import { UserDocument } from 'graphql/generated/graphql';
import { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import CreateClient from 'utils/CreateClient';

const Profile: NextPage<UserProfileProps> = ({ name, username }) => {
  return (
    <Box>
      <Head>
        <title>Lite Twitter</title>
        <meta
          name="description"
          content="Lite Twitter with GraphQL and Nextjs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!name || !username ? (
        <Flex>
          <Heading>The user doesn&apos;t exist.</Heading>
        </Flex>
      ) : (
        <UserProfile username={username || 'User'} name={name || 'Name'} />
      )}
    </Box>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const client = CreateClient(context?.req?.headers.cookie);
  const props = {
    username: null,
    name: null,
  };

  const { username } = context.query;

  const { data: userData } = await client.query({
    query: UserDocument,
    variables: { username },
  });

  if (userData?.user?.user) {
    props.username = userData.user.user.username;
    props.name = userData.user.user.name;
  }

  return {
    props: { ...props },
  };
}

export default Profile;
