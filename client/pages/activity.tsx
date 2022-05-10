import { Box } from '@chakra-ui/react';
import UserProfile from 'components/shared/UserProfile';
import { NextPage } from 'next';
import Head from 'next/head';
import { useUserContext } from 'providers/UserProvider';

const Profile: NextPage = () => {
  const { user } = useUserContext();

  return (
    <Box>
      <Head>
        <title>{`${user?.name || ''} | `}Lite Twitter</title>
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
