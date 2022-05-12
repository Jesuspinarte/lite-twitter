import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type CommentsResponse = {
  __typename?: 'CommentsResponse';
  comments?: Maybe<Array<Tweet>>;
  errors?: Maybe<Array<ErrorMessage>>;
  nextSkip?: Maybe<Scalars['Float']>;
  nextTake?: Maybe<Scalars['Float']>;
  tweet?: Maybe<Tweet>;
};

export type ErrorMessage = {
  __typename?: 'ErrorMessage';
  field?: Maybe<Scalars['String']>;
  message: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  deleteTweet: TweetResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  postTweet: TweetResponse;
  register: UserResponse;
  unvote: VoteResponse;
  updateUserInfo: UserResponse;
  uploadImage: Scalars['Boolean'];
  vote: VoteResponse;
};

export type MutationChangePasswordArgs = {
  password: PasswordInput;
};

export type MutationDeleteTweetArgs = {
  id: Scalars['String'];
};

export type MutationLoginArgs = {
  user: UserLoginInput;
};

export type MutationPostTweetArgs = {
  tweet: TweetInput;
};

export type MutationRegisterArgs = {
  user: UserInput;
};

export type MutationUnvoteArgs = {
  tweetId: Scalars['String'];
};

export type MutationUpdateUserInfoArgs = {
  user: UserInfo;
};

export type MutationUploadImageArgs = {
  file: Scalars['Upload'];
};

export type MutationVoteArgs = {
  tweetId: Scalars['String'];
};

export type PasswordInput = {
  newPassword: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  currentUser: UserResponse;
  feed: TweetsResponse;
  tweetComments: CommentsResponse;
  tweets: TweetsResponse;
  user: UserResponse;
  userTweets: TweetsResponse;
  userVotes: VotesResponse;
};

export type QueryFeedArgs = {
  params?: InputMaybe<TweetParams>;
};

export type QueryTweetCommentsArgs = {
  params: TweetCommentsParams;
};

export type QueryTweetsArgs = {
  ids: Array<Scalars['String']>;
};

export type QueryUserArgs = {
  username: Scalars['String'];
};

export type QueryUserTweetsArgs = {
  params: UserTweetsParams;
};

export type Subscription = {
  __typename?: 'Subscription';
  feedNotifications: TweetSubscriptionResponse;
};

export type Tweet = {
  __typename?: 'Tweet';
  comments: Array<Tweet>;
  commentsCount: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  hasVote: Scalars['Boolean'];
  hashtags: Array<Scalars['String']>;
  id: Scalars['String'];
  mentions: Array<User>;
  text: Scalars['String'];
  tweet?: Maybe<Tweet>;
  user: User;
  votes: Array<Vote>;
  votesCount: Scalars['Float'];
};

export type TweetCommentsParams = {
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
  tweetId: Scalars['String'];
};

export type TweetInput = {
  text: Scalars['String'];
  tweetId?: InputMaybe<Scalars['String']>;
};

export type TweetParams = {
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
};

export type TweetResponse = {
  __typename?: 'TweetResponse';
  errors?: Maybe<Array<ErrorMessage>>;
  tweet?: Maybe<Tweet>;
};

export type TweetSubscriptionResponse = {
  __typename?: 'TweetSubscriptionResponse';
  errors?: Maybe<Array<ErrorMessage>>;
  tweetId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type TweetsResponse = {
  __typename?: 'TweetsResponse';
  errors?: Maybe<Array<ErrorMessage>>;
  nextSkip?: Maybe<Scalars['Float']>;
  nextTake?: Maybe<Scalars['Float']>;
  tweets?: Maybe<Array<Tweet>>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  tweets: Array<Tweet>;
  username: Scalars['String'];
  votes: Array<Vote>;
};

export type UserInfo = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type UserInput = {
  email: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserLoginInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<ErrorMessage>>;
  token?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type UserTweetsParams = {
  skip?: InputMaybe<Scalars['Float']>;
  take?: InputMaybe<Scalars['Float']>;
  username: Scalars['String'];
};

export type Vote = {
  __typename?: 'Vote';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  tweet: Tweet;
  user: User;
};

export type VoteResponse = {
  __typename?: 'VoteResponse';
  errors?: Maybe<Array<ErrorMessage>>;
  vote?: Maybe<Vote>;
};

export type VotesResponse = {
  __typename?: 'VotesResponse';
  errors?: Maybe<Array<ErrorMessage>>;
  votes?: Maybe<Array<Vote>>;
};

export type ErrorInfoFragment = {
  __typename?: 'ErrorMessage';
  field?: string | null;
  message: string;
};

export type FullErrorInfoFragment = {
  __typename?: 'ErrorMessage';
  field?: string | null;
  message: string;
  type?: string | null;
};

export type TweetInfoFragment = {
  __typename?: 'Tweet';
  id: string;
  text: string;
  votesCount: number;
  commentsCount: number;
  hashtags: Array<string>;
  createdAt: any;
  hasVote: boolean;
  user: { __typename?: 'User'; id: string; name: string; username: string };
  mentions: Array<{
    __typename?: 'User';
    id: string;
    username: string;
    name: string;
  }>;
};

export type UserInfoFragment = {
  __typename?: 'User';
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: any;
};

export type VoteInfoFragment = {
  __typename?: 'Vote';
  id: string;
  user: { __typename?: 'User'; name: string };
  tweet: {
    __typename?: 'Tweet';
    text: string;
    commentsCount: number;
    votesCount: number;
  };
};

export type UploadImageMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;

export type UploadImageMutation = {
  __typename?: 'Mutation';
  uploadImage: boolean;
};

export type PostTweetMutationVariables = Exact<{
  tweet: TweetInput;
}>;

export type PostTweetMutation = {
  __typename?: 'Mutation';
  postTweet: {
    __typename?: 'TweetResponse';
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
    tweet?: {
      __typename?: 'Tweet';
      id: string;
      text: string;
      votesCount: number;
      commentsCount: number;
      hashtags: Array<string>;
      createdAt: any;
      hasVote: boolean;
      tweet?: { __typename?: 'Tweet'; commentsCount: number } | null;
      user: { __typename?: 'User'; id: string; name: string; username: string };
      mentions: Array<{
        __typename?: 'User';
        id: string;
        username: string;
        name: string;
      }>;
    } | null;
  };
};

export type LoginMutationVariables = Exact<{
  user: UserLoginInput;
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login: {
    __typename?: 'UserResponse';
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
    }> | null;
    user?: {
      __typename?: 'User';
      id: string;
      name: string;
      username: string;
      email: string;
      createdAt: any;
    } | null;
  };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: 'Mutation'; logout: boolean };

export type RegisterMutationVariables = Exact<{
  user: UserInput;
}>;

export type RegisterMutation = {
  __typename?: 'Mutation';
  register: {
    __typename?: 'UserResponse';
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
    }> | null;
    user?: {
      __typename?: 'User';
      id: string;
      name: string;
      username: string;
      email: string;
      createdAt: any;
    } | null;
  };
};

export type UnvoteMutationVariables = Exact<{
  tweetId: Scalars['String'];
}>;

export type UnvoteMutation = {
  __typename?: 'Mutation';
  unvote: {
    __typename?: 'VoteResponse';
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
    vote?: {
      __typename?: 'Vote';
      id: string;
      user: { __typename?: 'User'; name: string };
      tweet: {
        __typename?: 'Tweet';
        text: string;
        commentsCount: number;
        votesCount: number;
      };
    } | null;
  };
};

export type VoteMutationVariables = Exact<{
  tweetId: Scalars['String'];
}>;

export type VoteMutation = {
  __typename?: 'Mutation';
  vote: {
    __typename?: 'VoteResponse';
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
    vote?: {
      __typename?: 'Vote';
      id: string;
      user: { __typename?: 'User'; name: string };
      tweet: {
        __typename?: 'Tweet';
        text: string;
        commentsCount: number;
        votesCount: number;
      };
    } | null;
  };
};

export type FeedQueryVariables = Exact<{
  params: TweetParams;
}>;

export type FeedQuery = {
  __typename?: 'Query';
  feed: {
    __typename?: 'TweetsResponse';
    nextSkip?: number | null;
    nextTake?: number | null;
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
    tweets?: Array<{
      __typename?: 'Tweet';
      id: string;
      text: string;
      votesCount: number;
      commentsCount: number;
      hashtags: Array<string>;
      createdAt: any;
      hasVote: boolean;
      tweet?: {
        __typename?: 'Tweet';
        id: string;
        text: string;
        votesCount: number;
        commentsCount: number;
        hashtags: Array<string>;
        createdAt: any;
        hasVote: boolean;
        user: {
          __typename?: 'User';
          id: string;
          name: string;
          username: string;
        };
        mentions: Array<{
          __typename?: 'User';
          id: string;
          username: string;
          name: string;
        }>;
      } | null;
      user: { __typename?: 'User'; id: string; name: string; username: string };
      mentions: Array<{
        __typename?: 'User';
        id: string;
        username: string;
        name: string;
      }>;
    }> | null;
  };
};

export type TweetCommentsQueryVariables = Exact<{
  params: TweetCommentsParams;
}>;

export type TweetCommentsQuery = {
  __typename?: 'Query';
  tweetComments: {
    __typename?: 'CommentsResponse';
    nextSkip?: number | null;
    nextTake?: number | null;
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
    tweet?: {
      __typename?: 'Tweet';
      id: string;
      text: string;
      votesCount: number;
      commentsCount: number;
      hashtags: Array<string>;
      createdAt: any;
      hasVote: boolean;
      user: { __typename?: 'User'; id: string; name: string; username: string };
      mentions: Array<{
        __typename?: 'User';
        id: string;
        username: string;
        name: string;
      }>;
    } | null;
    comments?: Array<{
      __typename?: 'Tweet';
      id: string;
      text: string;
      votesCount: number;
      commentsCount: number;
      hashtags: Array<string>;
      createdAt: any;
      hasVote: boolean;
      user: { __typename?: 'User'; id: string; name: string; username: string };
      mentions: Array<{
        __typename?: 'User';
        id: string;
        username: string;
        name: string;
      }>;
    }> | null;
  };
};

export type TweetWithCommentsQueryVariables = Exact<{
  params: TweetCommentsParams;
}>;

export type TweetWithCommentsQuery = {
  __typename?: 'Query';
  tweetComments: {
    __typename?: 'CommentsResponse';
    nextSkip?: number | null;
    nextTake?: number | null;
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
    tweet?: {
      __typename?: 'Tweet';
      id: string;
      text: string;
      votesCount: number;
      commentsCount: number;
      hashtags: Array<string>;
      createdAt: any;
      hasVote: boolean;
      user: { __typename?: 'User'; id: string; name: string; username: string };
      mentions: Array<{
        __typename?: 'User';
        id: string;
        username: string;
        name: string;
      }>;
    } | null;
    comments?: Array<{
      __typename?: 'Tweet';
      id: string;
      text: string;
      votesCount: number;
      commentsCount: number;
      hashtags: Array<string>;
      createdAt: any;
      hasVote: boolean;
      user: { __typename?: 'User'; id: string; name: string; username: string };
      mentions: Array<{
        __typename?: 'User';
        id: string;
        username: string;
        name: string;
      }>;
    }> | null;
  };
};

export type TweetsQueryVariables = Exact<{
  ids: Array<Scalars['String']> | Scalars['String'];
}>;

export type TweetsQuery = {
  __typename?: 'Query';
  tweets: {
    __typename?: 'TweetsResponse';
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
    tweets?: Array<{
      __typename?: 'Tweet';
      id: string;
      text: string;
      votesCount: number;
      commentsCount: number;
      hashtags: Array<string>;
      createdAt: any;
      hasVote: boolean;
      tweet?: {
        __typename?: 'Tweet';
        id: string;
        text: string;
        votesCount: number;
        commentsCount: number;
        hashtags: Array<string>;
        createdAt: any;
        hasVote: boolean;
        user: {
          __typename?: 'User';
          id: string;
          name: string;
          username: string;
        };
        mentions: Array<{
          __typename?: 'User';
          id: string;
          username: string;
          name: string;
        }>;
      } | null;
      user: { __typename?: 'User'; id: string; name: string; username: string };
      mentions: Array<{
        __typename?: 'User';
        id: string;
        username: string;
        name: string;
      }>;
    }> | null;
  };
};

export type UserTweetsQueryVariables = Exact<{
  params: UserTweetsParams;
}>;

export type UserTweetsQuery = {
  __typename?: 'Query';
  userTweets: {
    __typename?: 'TweetsResponse';
    nextSkip?: number | null;
    nextTake?: number | null;
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
    tweets?: Array<{
      __typename?: 'Tweet';
      id: string;
      text: string;
      votesCount: number;
      commentsCount: number;
      hashtags: Array<string>;
      createdAt: any;
      hasVote: boolean;
      tweet?: {
        __typename?: 'Tweet';
        id: string;
        text: string;
        votesCount: number;
        commentsCount: number;
        hashtags: Array<string>;
        createdAt: any;
        hasVote: boolean;
        user: {
          __typename?: 'User';
          id: string;
          name: string;
          username: string;
        };
        mentions: Array<{
          __typename?: 'User';
          id: string;
          username: string;
          name: string;
        }>;
      } | null;
      user: { __typename?: 'User'; id: string; name: string; username: string };
      mentions: Array<{
        __typename?: 'User';
        id: string;
        username: string;
        name: string;
      }>;
    }> | null;
  };
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: 'Query';
  currentUser: {
    __typename?: 'UserResponse';
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
    user?: {
      __typename?: 'User';
      id: string;
      name: string;
      username: string;
      email: string;
      createdAt: any;
    } | null;
  };
};

export type UserQueryVariables = Exact<{
  username: Scalars['String'];
}>;

export type UserQuery = {
  __typename?: 'Query';
  user: {
    __typename?: 'UserResponse';
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
    user?: {
      __typename?: 'User';
      id: string;
      name: string;
      username: string;
      email: string;
      createdAt: any;
    } | null;
  };
};

export type FeedNotificationsSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type FeedNotificationsSubscription = {
  __typename?: 'Subscription';
  feedNotifications: {
    __typename?: 'TweetSubscriptionResponse';
    tweetId?: string | null;
    userId?: string | null;
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      message: string;
      type?: string | null;
    }> | null;
  };
};

export const ErrorInfoFragmentDoc = gql`
  fragment ErrorInfo on ErrorMessage {
    field
    message
  }
`;
export const FullErrorInfoFragmentDoc = gql`
  fragment FullErrorInfo on ErrorMessage {
    field
    message
    type
  }
`;
export const TweetInfoFragmentDoc = gql`
  fragment TweetInfo on Tweet {
    id
    text
    votesCount
    commentsCount
    hashtags
    createdAt
    hasVote
    user {
      id
      name
      username
    }
    mentions {
      id
      username
      name
    }
  }
`;
export const UserInfoFragmentDoc = gql`
  fragment UserInfo on User {
    id
    name
    username
    email
    createdAt
  }
`;
export const VoteInfoFragmentDoc = gql`
  fragment VoteInfo on Vote {
    id
    user {
      name
    }
    tweet {
      text
      commentsCount
      votesCount
    }
  }
`;
export const UploadImageDocument = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file)
  }
`;
export type UploadImageMutationFn = Apollo.MutationFunction<
  UploadImageMutation,
  UploadImageMutationVariables
>;

/**
 * __useUploadImageMutation__
 *
 * To run a mutation, you first call `useUploadImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadImageMutation, { data, loading, error }] = useUploadImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadImageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UploadImageMutation,
    UploadImageMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UploadImageMutation, UploadImageMutationVariables>(
    UploadImageDocument,
    options
  );
}
export type UploadImageMutationHookResult = ReturnType<
  typeof useUploadImageMutation
>;
export type UploadImageMutationResult =
  Apollo.MutationResult<UploadImageMutation>;
export type UploadImageMutationOptions = Apollo.BaseMutationOptions<
  UploadImageMutation,
  UploadImageMutationVariables
>;
export const PostTweetDocument = gql`
  mutation PostTweet($tweet: TweetInput!) {
    postTweet(tweet: $tweet) {
      errors {
        ...FullErrorInfo
      }
      tweet {
        ...TweetInfo
        tweet {
          commentsCount
        }
      }
    }
  }
  ${FullErrorInfoFragmentDoc}
  ${TweetInfoFragmentDoc}
`;
export type PostTweetMutationFn = Apollo.MutationFunction<
  PostTweetMutation,
  PostTweetMutationVariables
>;

/**
 * __usePostTweetMutation__
 *
 * To run a mutation, you first call `usePostTweetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostTweetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postTweetMutation, { data, loading, error }] = usePostTweetMutation({
 *   variables: {
 *      tweet: // value for 'tweet'
 *   },
 * });
 */
export function usePostTweetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PostTweetMutation,
    PostTweetMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PostTweetMutation, PostTweetMutationVariables>(
    PostTweetDocument,
    options
  );
}
export type PostTweetMutationHookResult = ReturnType<
  typeof usePostTweetMutation
>;
export type PostTweetMutationResult = Apollo.MutationResult<PostTweetMutation>;
export type PostTweetMutationOptions = Apollo.BaseMutationOptions<
  PostTweetMutation,
  PostTweetMutationVariables
>;
export const LoginDocument = gql`
  mutation Login($user: UserLoginInput!) {
    login(user: $user) {
      errors {
        ...ErrorInfo
      }
      user {
        ...UserInfo
      }
    }
  }
  ${ErrorInfoFragmentDoc}
  ${UserInfoFragmentDoc}
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    options
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const RegisterDocument = gql`
  mutation Register($user: UserInput!) {
    register(user: $user) {
      errors {
        ...ErrorInfo
      }
      user {
        ...UserInfo
      }
    }
  }
  ${ErrorInfoFragmentDoc}
  ${UserInfoFragmentDoc}
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const UnvoteDocument = gql`
  mutation Unvote($tweetId: String!) {
    unvote(tweetId: $tweetId) {
      errors {
        ...FullErrorInfo
      }
      vote {
        ...VoteInfo
      }
    }
  }
  ${FullErrorInfoFragmentDoc}
  ${VoteInfoFragmentDoc}
`;
export type UnvoteMutationFn = Apollo.MutationFunction<
  UnvoteMutation,
  UnvoteMutationVariables
>;

/**
 * __useUnvoteMutation__
 *
 * To run a mutation, you first call `useUnvoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnvoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unvoteMutation, { data, loading, error }] = useUnvoteMutation({
 *   variables: {
 *      tweetId: // value for 'tweetId'
 *   },
 * });
 */
export function useUnvoteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnvoteMutation,
    UnvoteMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UnvoteMutation, UnvoteMutationVariables>(
    UnvoteDocument,
    options
  );
}
export type UnvoteMutationHookResult = ReturnType<typeof useUnvoteMutation>;
export type UnvoteMutationResult = Apollo.MutationResult<UnvoteMutation>;
export type UnvoteMutationOptions = Apollo.BaseMutationOptions<
  UnvoteMutation,
  UnvoteMutationVariables
>;
export const VoteDocument = gql`
  mutation Vote($tweetId: String!) {
    vote(tweetId: $tweetId) {
      errors {
        ...FullErrorInfo
      }
      vote {
        ...VoteInfo
      }
    }
  }
  ${FullErrorInfoFragmentDoc}
  ${VoteInfoFragmentDoc}
`;
export type VoteMutationFn = Apollo.MutationFunction<
  VoteMutation,
  VoteMutationVariables
>;

/**
 * __useVoteMutation__
 *
 * To run a mutation, you first call `useVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteMutation, { data, loading, error }] = useVoteMutation({
 *   variables: {
 *      tweetId: // value for 'tweetId'
 *   },
 * });
 */
export function useVoteMutation(
  baseOptions?: Apollo.MutationHookOptions<VoteMutation, VoteMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<VoteMutation, VoteMutationVariables>(
    VoteDocument,
    options
  );
}
export type VoteMutationHookResult = ReturnType<typeof useVoteMutation>;
export type VoteMutationResult = Apollo.MutationResult<VoteMutation>;
export type VoteMutationOptions = Apollo.BaseMutationOptions<
  VoteMutation,
  VoteMutationVariables
>;
export const FeedDocument = gql`
  query Feed($params: TweetParams!) {
    feed(params: $params) {
      errors {
        ...FullErrorInfo
      }
      nextSkip
      nextTake
      tweets {
        ...TweetInfo
        tweet {
          ...TweetInfo
        }
      }
    }
  }
  ${FullErrorInfoFragmentDoc}
  ${TweetInfoFragmentDoc}
`;

/**
 * __useFeedQuery__
 *
 * To run a query within a React component, call `useFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedQuery({
 *   variables: {
 *      params: // value for 'params'
 *   },
 * });
 */
export function useFeedQuery(
  baseOptions: Apollo.QueryHookOptions<FeedQuery, FeedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FeedQuery, FeedQueryVariables>(FeedDocument, options);
}
export function useFeedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<FeedQuery, FeedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FeedQuery, FeedQueryVariables>(
    FeedDocument,
    options
  );
}
export type FeedQueryHookResult = ReturnType<typeof useFeedQuery>;
export type FeedLazyQueryHookResult = ReturnType<typeof useFeedLazyQuery>;
export type FeedQueryResult = Apollo.QueryResult<FeedQuery, FeedQueryVariables>;
export const TweetCommentsDocument = gql`
  query TweetComments($params: TweetCommentsParams!) {
    tweetComments(params: $params) {
      errors {
        ...FullErrorInfo
      }
      nextSkip
      nextTake
      tweet {
        ...TweetInfo
      }
      comments {
        ...TweetInfo
      }
    }
  }
  ${FullErrorInfoFragmentDoc}
  ${TweetInfoFragmentDoc}
`;

/**
 * __useTweetCommentsQuery__
 *
 * To run a query within a React component, call `useTweetCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTweetCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTweetCommentsQuery({
 *   variables: {
 *      params: // value for 'params'
 *   },
 * });
 */
export function useTweetCommentsQuery(
  baseOptions: Apollo.QueryHookOptions<
    TweetCommentsQuery,
    TweetCommentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TweetCommentsQuery, TweetCommentsQueryVariables>(
    TweetCommentsDocument,
    options
  );
}
export function useTweetCommentsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TweetCommentsQuery,
    TweetCommentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TweetCommentsQuery, TweetCommentsQueryVariables>(
    TweetCommentsDocument,
    options
  );
}
export type TweetCommentsQueryHookResult = ReturnType<
  typeof useTweetCommentsQuery
>;
export type TweetCommentsLazyQueryHookResult = ReturnType<
  typeof useTweetCommentsLazyQuery
>;
export type TweetCommentsQueryResult = Apollo.QueryResult<
  TweetCommentsQuery,
  TweetCommentsQueryVariables
>;
export const TweetWithCommentsDocument = gql`
  query TweetWithComments($params: TweetCommentsParams!) {
    tweetComments(params: $params) {
      errors {
        ...FullErrorInfo
      }
      nextSkip
      nextTake
      tweet {
        ...TweetInfo
      }
      comments {
        ...TweetInfo
      }
    }
  }
  ${FullErrorInfoFragmentDoc}
  ${TweetInfoFragmentDoc}
`;

/**
 * __useTweetWithCommentsQuery__
 *
 * To run a query within a React component, call `useTweetWithCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTweetWithCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTweetWithCommentsQuery({
 *   variables: {
 *      params: // value for 'params'
 *   },
 * });
 */
export function useTweetWithCommentsQuery(
  baseOptions: Apollo.QueryHookOptions<
    TweetWithCommentsQuery,
    TweetWithCommentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    TweetWithCommentsQuery,
    TweetWithCommentsQueryVariables
  >(TweetWithCommentsDocument, options);
}
export function useTweetWithCommentsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TweetWithCommentsQuery,
    TweetWithCommentsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TweetWithCommentsQuery,
    TweetWithCommentsQueryVariables
  >(TweetWithCommentsDocument, options);
}
export type TweetWithCommentsQueryHookResult = ReturnType<
  typeof useTweetWithCommentsQuery
>;
export type TweetWithCommentsLazyQueryHookResult = ReturnType<
  typeof useTweetWithCommentsLazyQuery
>;
export type TweetWithCommentsQueryResult = Apollo.QueryResult<
  TweetWithCommentsQuery,
  TweetWithCommentsQueryVariables
>;
export const TweetsDocument = gql`
  query Tweets($ids: [String!]!) {
    tweets(ids: $ids) {
      errors {
        ...FullErrorInfo
      }
      tweets {
        ...TweetInfo
        tweet {
          ...TweetInfo
        }
      }
    }
  }
  ${FullErrorInfoFragmentDoc}
  ${TweetInfoFragmentDoc}
`;

/**
 * __useTweetsQuery__
 *
 * To run a query within a React component, call `useTweetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTweetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTweetsQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useTweetsQuery(
  baseOptions: Apollo.QueryHookOptions<TweetsQuery, TweetsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TweetsQuery, TweetsQueryVariables>(
    TweetsDocument,
    options
  );
}
export function useTweetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TweetsQuery, TweetsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TweetsQuery, TweetsQueryVariables>(
    TweetsDocument,
    options
  );
}
export type TweetsQueryHookResult = ReturnType<typeof useTweetsQuery>;
export type TweetsLazyQueryHookResult = ReturnType<typeof useTweetsLazyQuery>;
export type TweetsQueryResult = Apollo.QueryResult<
  TweetsQuery,
  TweetsQueryVariables
>;
export const UserTweetsDocument = gql`
  query UserTweets($params: UserTweetsParams!) {
    userTweets(params: $params) {
      errors {
        ...FullErrorInfo
      }
      nextSkip
      nextTake
      tweets {
        ...TweetInfo
        tweet {
          ...TweetInfo
        }
      }
    }
  }
  ${FullErrorInfoFragmentDoc}
  ${TweetInfoFragmentDoc}
`;

/**
 * __useUserTweetsQuery__
 *
 * To run a query within a React component, call `useUserTweetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserTweetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserTweetsQuery({
 *   variables: {
 *      params: // value for 'params'
 *   },
 * });
 */
export function useUserTweetsQuery(
  baseOptions: Apollo.QueryHookOptions<
    UserTweetsQuery,
    UserTweetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserTweetsQuery, UserTweetsQueryVariables>(
    UserTweetsDocument,
    options
  );
}
export function useUserTweetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserTweetsQuery,
    UserTweetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserTweetsQuery, UserTweetsQueryVariables>(
    UserTweetsDocument,
    options
  );
}
export type UserTweetsQueryHookResult = ReturnType<typeof useUserTweetsQuery>;
export type UserTweetsLazyQueryHookResult = ReturnType<
  typeof useUserTweetsLazyQuery
>;
export type UserTweetsQueryResult = Apollo.QueryResult<
  UserTweetsQuery,
  UserTweetsQueryVariables
>;
export const CurrentUserDocument = gql`
  query CurrentUser {
    currentUser {
      errors {
        ...FullErrorInfo
      }
      user {
        ...UserInfo
      }
    }
  }
  ${FullErrorInfoFragmentDoc}
  ${UserInfoFragmentDoc}
`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    options
  );
}
export function useCurrentUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CurrentUserQuery,
    CurrentUserQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    options
  );
}
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<
  typeof useCurrentUserLazyQuery
>;
export type CurrentUserQueryResult = Apollo.QueryResult<
  CurrentUserQuery,
  CurrentUserQueryVariables
>;
export const UserDocument = gql`
  query User($username: String!) {
    user(username: $username) {
      errors {
        ...FullErrorInfo
      }
      user {
        ...UserInfo
      }
    }
  }
  ${FullErrorInfoFragmentDoc}
  ${UserInfoFragmentDoc}
`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUserQuery(
  baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
}
export function useUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    options
  );
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const FeedNotificationsDocument = gql`
  subscription FeedNotifications {
    feedNotifications {
      errors {
        field
        message
        type
      }
      tweetId
      userId
    }
  }
`;

/**
 * __useFeedNotificationsSubscription__
 *
 * To run a query within a React component, call `useFeedNotificationsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useFeedNotificationsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedNotificationsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useFeedNotificationsSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    FeedNotificationsSubscription,
    FeedNotificationsSubscriptionVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    FeedNotificationsSubscription,
    FeedNotificationsSubscriptionVariables
  >(FeedNotificationsDocument, options);
}
export type FeedNotificationsSubscriptionHookResult = ReturnType<
  typeof useFeedNotificationsSubscription
>;
export type FeedNotificationsSubscriptionResult =
  Apollo.SubscriptionResult<FeedNotificationsSubscription>;
