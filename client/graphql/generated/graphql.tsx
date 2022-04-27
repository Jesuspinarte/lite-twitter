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
  userVotes: VotesResponse;
};

export type QueryFeedArgs = {
  params?: InputMaybe<TweetParams>;
};

export type Tweet = {
  __typename?: 'Tweet';
  comments: Array<Tweet>;
  commentsCount: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  hashtags: Array<Scalars['String']>;
  id: Scalars['String'];
  mentions: Array<User>;
  text: Scalars['String'];
  tweet?: Maybe<Tweet>;
  user: User;
  votes: Array<Vote>;
  votesCount: Scalars['Float'];
};

export type TweetInput = {
  text: Scalars['String'];
  tweetId?: InputMaybe<Scalars['String']>;
};

export type TweetParams = {
  page?: InputMaybe<Scalars['Float']>;
  perPage?: InputMaybe<Scalars['Float']>;
};

export type TweetResponse = {
  __typename?: 'TweetResponse';
  errors?: Maybe<Array<ErrorMessage>>;
  tweet?: Maybe<Tweet>;
};

export type TweetsResponse = {
  __typename?: 'TweetsResponse';
  errors?: Maybe<Array<ErrorMessage>>;
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

export type FeedQueryVariables = Exact<{
  params: TweetParams;
}>;

export type FeedQuery = {
  __typename?: 'Query';
  feed: {
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

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: 'Query';
  currentUser: {
    __typename?: 'UserResponse';
    errors?: Array<{
      __typename?: 'ErrorMessage';
      field?: string | null;
      type?: string | null;
      message: string;
    }> | null;
    user?: {
      __typename?: 'User';
      id: string;
      email: string;
      name: string;
      username: string;
      createdAt: any;
    } | null;
  };
};

export const FeedDocument = gql`
  query Feed($params: TweetParams!) {
    feed(params: $params) {
      errors {
        field
        message
        type
      }
      tweets {
        id
        text
        user {
          id
          name
          username
        }
        votesCount
        commentsCount
        hashtags
        mentions {
          id
          username
          name
        }
      }
    }
  }
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
export const LoginDocument = gql`
  mutation Login($user: UserLoginInput!) {
    login(user: $user) {
      errors {
        field
        message
      }
      user {
        id
        name
        username
        email
        createdAt
      }
    }
  }
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
        field
        message
      }
      user {
        id
        name
        username
        email
        createdAt
      }
    }
  }
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
export const CurrentUserDocument = gql`
  query CurrentUser {
    currentUser {
      errors {
        field
        type
        message
      }
      user {
        id
        email
        name
        username
        createdAt
      }
    }
  }
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
