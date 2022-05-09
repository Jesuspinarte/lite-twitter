import { Box } from '@chakra-ui/react';
import UserProfile from 'components/shared/UserProfile';
import { CurrentUserDocument, User } from 'graphql/generated/graphql';
import { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import UserProvider, { useUserContext } from 'providers/UserProvider';
import CreateClient from 'utils/CreateClient';

interface ProfileProps {
  user: User;
}

const Profile: NextPage = props => {
  const { user } = useUserContext();

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
      <UserProfile
        username={user?.username || 'User'}
        name={user?.name || 'Name'}
      />
    </Box>
  );
};

export default Profile;
