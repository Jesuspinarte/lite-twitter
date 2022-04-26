import React, {
  MutableRefObject,
  RefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { gql, useMutation } from '@apollo/client';

type SignFormProps = PropsWithChildren<{ signIn?: boolean }>;

const LOGIN_MUTATION = gql`
  mutation ($user: UserLoginInput!) {
    login(user: $user) {
      errors {
        field
        message
      }
      token
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

export const SignForm: React.FC<SignFormProps> = ({ signIn = true }) => {
  const [showPassword, setShowPassword] = useState(false);
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      user: {
        username: username.current?.value,
        password: password.current?.value,
      },
    },
  });

  const infoBgColor = useColorModeValue('teal.300', 'teal.200');
  const submitBgColor = useColorModeValue('gray.800', 'teal.200');
  const submitTextColor = useColorModeValue('whiteAlpha.900', 'gray.800');

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLDivElement>) => {
      event.preventDefault();

      try {
        const data = await login();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    [login]
  );

  return (
    <Flex as="article" height="100vh" width="100vw">
      <Box width="50%" height="100%" backgroundColor={infoBgColor} />
      <Flex
        width="50%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        boxShadow="-1px 0 20px 1px #111"
      >
        <Flex as="form" flexFlow="row wrap" p={14} onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              type="text"
              variant="flushed"
              p={4}
              ref={username}
            />

            <FormHelperText>Username is not casae sensitive.</FormHelperText>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup size="md">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                variant="flushed"
                p={4}
                ref={password}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(prevState => !prevState)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {!signIn && 'Register'}
          <Button
            width="100%"
            type="submit"
            backgroundColor={submitBgColor}
            color={submitTextColor}
          >
            Log In
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
