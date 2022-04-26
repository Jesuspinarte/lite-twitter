import { useCallback, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
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
import { useLoginMutation, User } from '../graphql/generated/graphql';
import { useUserContext } from '../providers/UserProvider';

type SignFormProps = PropsWithChildren<{ signIn?: boolean }>;

export const SignForm: React.FC<SignFormProps> = ({ signIn = true }) => {
  const { user, setUser } = useUserContext();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const [login] = useLoginMutation({
    variables: {
      user: {
        username: username.current?.value || '',
        password: password.current?.value || '',
      },
    },
    onCompleted: ({ login: { errors: loginErrors, user } }) => {
      if (!loginErrors?.length) {
        setUser(user as User);
        router.push('/');
      } else {
        const newErrors: Record<string, string> = {};

        for (let error of loginErrors) {
          if (error.field) {
            newErrors[error.field] = error.message;
          }
        }

        setErrors(newErrors);
        setIsLoading(false);
      }
    },
  });

  const errorColor = 'red.300';
  const infoBgColor = useColorModeValue('teal.300', 'teal.200');
  const submitBgColor = useColorModeValue('gray.800', 'teal.200');
  const submitTextColor = useColorModeValue('whiteAlpha.900', 'gray.800');
  const autoFillStyles = {
    textFillColor: '#c6c6c6',
    transition: 'background-color 5000s ease-in-out 0s',
  };

  const disableForm = useMemo(() => isLoading || !!user, [isLoading, user]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!disableForm) {
        setIsLoading(true);
        try {
          await login();
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      }
    },
    [login, disableForm]
  );

  const removeErrorsOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors(prevState => {
      const newErrors = { ...prevState };
      delete newErrors[event.target.name];
      return newErrors;
    });
  };

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
              isInvalid={!!errors.username}
              id="username"
              name="username"
              type="text"
              variant="flushed"
              p={4}
              ref={username}
              _autofill={autoFillStyles}
              onChange={removeErrorsOnChange}
              disabled={disableForm}
            />
            {!!errors.username ? (
              <FormHelperText color={errorColor}>
                {errors.username}
              </FormHelperText>
            ) : (
              <FormHelperText>Username is not case sensitive.</FormHelperText>
            )}
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup size="md">
              <Input
                isInvalid={!!errors.password}
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="flushed"
                p={4}
                ref={password}
                _autofill={autoFillStyles}
                onChange={removeErrorsOnChange}
                disabled={disableForm}
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
            {!!errors.password && (
              <FormHelperText color={errorColor}>
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>
          {!signIn && 'Register'}
          <Button
            width="100%"
            type="submit"
            backgroundColor={submitBgColor}
            color={submitTextColor}
            disabled={disableForm}
          >
            Log In
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
