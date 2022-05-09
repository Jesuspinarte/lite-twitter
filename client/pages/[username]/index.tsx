import { Box } from '@chakra-ui/react';
import { NextPageContext } from 'next';
import CreateClient from 'utils/CreateClient';

const Profile = () => {
  return (
    <Box>
      <h1>user</h1>
    </Box>
  );
};

// export async function getServerSideProps(context: NextPageContext) {
//   const client = CreateClient(context?.req?.headers.cookie);

//   const { username } = context.query;

//   const { data } = await client.query({
//     query: ,
//     variables: {
//       params: {
//         skip: 0,
//         take: 4,
//         tweetId: id,
//       },
//     },
//   });

//   return {
//     props: {
//       ...(data.tweetComments || {
//         tweet: null,
//         comments: [],
//         nextSkip: null,
//         nextTake: null,
//       }),
//     },
//   };
// }

export default Profile;
