import { useCallback, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  useLoginMutation,
  User,
  useRegisterMutation,
} from '../graphql/generated/graphql';
import { useUserContext } from '../providers/UserProvider';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

type SignFormProps = PropsWithChildren<{ signIn?: boolean }>;

export const SignForm: React.FC<SignFormProps> = ({ signIn = true }) => {
  const { user, setUser } = useUserContext();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordHelper, setShowPasswordHelper] = useState(false);
  const [showUsernameHelper, setShowUsernameHelper] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const email = useRef<HTMLInputElement>(null);
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);

  const errorColor = 'red.300';
  const submitBgColor = useColorModeValue('gray.800', 'teal.200');
  const submitTextColor = useColorModeValue('whiteAlpha.900', 'gray.800');
  const linkColor = useColorModeValue('orange.600', 'orange.200');
  const autoFillStyles = {
    textFillColor: '#c6c6c6',
    transition: 'background-color 5000s ease-in-out 0s',
  };

  const disableForm = useMemo(() => isLoading || !!user, [isLoading, user]);

  const lowercaseMatch = useMemo(
    () => !!password.current?.value.match(/[a-z]/g),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [password.current?.value]
  );

  const uppercaseMatch = useMemo(
    () => !!password.current?.value.match(/[A-Z]/g),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [password.current?.value]
  );

  const digitMatch = useMemo(
    () => !!password.current?.value.match(/\d/g),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [password.current?.value]
  );

  const specialCharacterMatch = useMemo(
    () => !!password.current?.value.match(/(\W|_)/g),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [password.current?.value]
  );

  const lengthMatch = useMemo(
    () =>
      password.current?.value &&
      password.current?.value.length >= 6 &&
      password.current?.value.length <= 20,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [password.current?.value]
  );

  const isPasswordValid = useMemo(
    () =>
      lowercaseMatch &&
      uppercaseMatch &&
      digitMatch &&
      specialCharacterMatch &&
      lengthMatch,
    [
      lowercaseMatch,
      uppercaseMatch,
      digitMatch,
      specialCharacterMatch,
      lengthMatch,
    ]
  );

  const isUsernameValid = useMemo(
    () => !!username.current?.value.match(/^[a-z0-9A-Z\._-]{6,16}$/),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [username.current?.value]
  );

  const isEmailValid = useMemo(
    () =>
      !!email.current?.value.match(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [email.current?.value]
  );

  const canSubmit = useMemo(
    () =>
      signIn
        ? !!username.current?.value &&
          !!password.current?.value &&
          !Object.keys(errors).length
        : !!username.current?.value &&
          !!email.current?.value &&
          !!name.current?.value &&
          !!password.current?.value &&
          !!confirmPassword.current?.value &&
          isEmailValid &&
          isUsernameValid &&
          isPasswordValid &&
          !Object.keys(errors).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      username.current?.value,
      email.current?.value,
      name.current?.value,
      password.current?.value,
      confirmPassword.current?.value,
      isEmailValid,
      isUsernameValid,
      isPasswordValid,
      errors,
      signIn,
    ]
  );

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

  const [register] = useRegisterMutation({
    variables: {
      user: {
        username: username.current?.value || '',
        password: password.current?.value || '',
        email: email.current?.value || '',
        name: name.current?.value || '',
      },
    },
    onCompleted: ({ register: { errors: loginErrors, user } }) => {
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

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!disableForm && canSubmit) {
        setIsLoading(true);
        try {
          if (signIn) {
            await login();
          } else {
            await register();
          }
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      }
    },
    [login, register, disableForm, signIn, canSubmit]
  );

  const removeErrorsOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors(prevState => {
      const newErrors = { ...prevState };
      delete newErrors[event.target.name];
      return newErrors;
    });
  };

  const removeAllErrorsOnChange = () => {
    setErrors({});
  };

  const validateConfirmPassword = (
    currentConfirmPassword: string | undefined
  ) => {
    if (
      currentConfirmPassword &&
      currentConfirmPassword !== password.current?.value
    ) {
      setErrors(prevState => ({
        ...prevState,
        'confirm-password': 'Passwords must match.',
      }));
    } else {
      setErrors(prevState => {
        const newErrors = { ...prevState };
        delete newErrors['confirm-password'];
        return newErrors;
      });
    }
  };

  return (
    <Flex
      as="form"
      flexFlow="row wrap"
      p={14}
      onSubmit={handleSubmit}
      maxW={615}
      width="100%"
    >
      <Box
        as={motion.div}
        initial={{ y: 200, opacity: 0, scale: 1 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        width="100%"
      >
        {!signIn && (
          <>
            <FormControl mb={4}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                isInvalid={!!errors.email}
                id="email"
                name="email"
                type="email"
                variant="flushed"
                p={4}
                ref={email}
                _autofill={autoFillStyles}
                onChange={removeErrorsOnChange}
                disabled={disableForm}
                required
              />
              {!!errors.email && (
                <FormHelperText color={errorColor}>
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                isInvalid={!!errors.name}
                id="name"
                name="name"
                type="text"
                variant="flushed"
                p={4}
                ref={name}
                _autofill={autoFillStyles}
                onChange={removeErrorsOnChange}
                disabled={disableForm}
                required
              />
              {!!errors.name && (
                <FormHelperText color={errorColor}>
                  {errors.name}
                </FormHelperText>
              )}
            </FormControl>
          </>
        )}
        <FormControl mb={4}>
          <FormLabel htmlFor="username">
            Username
            {!signIn && (
              <Popover
                placement="right"
                closeOnBlur
                isOpen={showUsernameHelper}
              >
                <PopoverTrigger>
                  <Badge
                    colorScheme={isUsernameValid ? 'green' : 'red'}
                    ml="1"
                    p={0.5}
                    pl={1.5}
                    pr={1.5}
                    fontSize="0.6em"
                    as="a"
                    cursor="pointer"
                    onMouseEnter={() => setShowUsernameHelper(true)}
                    onMouseLeave={() => setShowUsernameHelper(false)}
                  >
                    {isUsernameValid ? 'Valid' : 'Not valid'}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent _focus={{ outline: 'none' }}>
                  <PopoverArrow />
                  <PopoverCloseButton _focus={{ outline: 'none' }} />
                  <PopoverBody fontSize={13}>
                    Username can only have lowercase characters, uppercase
                    characters, digits, &quot;.&quot;, &quot;-&quot;,
                    &quot;_&quot; characters and between 6 - 16 characters
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
          </FormLabel>

          <Input
            isInvalid={!!errors.username}
            id="username"
            name="username"
            type="text"
            variant="flushed"
            p={4}
            ref={username}
            _autofill={autoFillStyles}
            onChange={signIn ? removeAllErrorsOnChange : removeErrorsOnChange}
            disabled={disableForm}
            required
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
          <FormLabel htmlFor="password">
            Password{' '}
            {!signIn && (
              <Popover
                placement="right"
                closeOnBlur
                isOpen={showPasswordHelper}
              >
                <PopoverTrigger>
                  <Badge
                    colorScheme={isPasswordValid ? 'green' : 'red'}
                    ml="1"
                    p={0.5}
                    pl={1.5}
                    pr={1.5}
                    fontSize="0.6em"
                    as="a"
                    cursor="pointer"
                    onMouseEnter={() => setShowPasswordHelper(true)}
                    onMouseLeave={() => setShowPasswordHelper(false)}
                  >
                    {isPasswordValid ? 'Valid' : 'Not valid'}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent _focus={{ outline: 'none' }}>
                  <PopoverHeader
                    pt={4}
                    fontWeight="bold"
                    border="0"
                    fontSize={14}
                  >
                    Password must contain the following:
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton _focus={{ outline: 'none' }} />
                  <PopoverBody fontSize={13}>
                    <List>
                      <ListItem>
                        <ListIcon
                          as={uppercaseMatch ? CheckCircleIcon : WarningIcon}
                          color={uppercaseMatch ? 'green.500' : 'red.500'}
                        />{' '}
                        A capital (uppercase) letter
                      </ListItem>
                      <ListItem>
                        <ListIcon
                          as={lowercaseMatch ? CheckCircleIcon : WarningIcon}
                          color={lowercaseMatch ? 'green.500' : 'red.500'}
                        />{' '}
                        A lowercase letter
                      </ListItem>
                      <ListItem>
                        <ListIcon
                          as={digitMatch ? CheckCircleIcon : WarningIcon}
                          color={digitMatch ? 'green.500' : 'red.500'}
                        />{' '}
                        A number
                      </ListItem>
                      <ListItem>
                        <ListIcon
                          as={
                            specialCharacterMatch
                              ? CheckCircleIcon
                              : WarningIcon
                          }
                          color={
                            specialCharacterMatch ? 'green.500' : 'red.500'
                          }
                        />{' '}
                        At least one special character
                      </ListItem>
                      <ListItem>
                        <ListIcon
                          as={lengthMatch ? CheckCircleIcon : WarningIcon}
                          color={lengthMatch ? 'green.500' : 'red.500'}
                        />{' '}
                        From 6 to 20 characters
                      </ListItem>
                    </List>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
          </FormLabel>
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
              onChange={
                signIn
                  ? removeAllErrorsOnChange
                  : e => {
                      validateConfirmPassword(confirmPassword.current?.value);
                      removeErrorsOnChange(e);
                    }
              }
              disabled={disableForm}
              required
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
        {!signIn && (
          <FormControl mb={4}>
            <FormLabel htmlFor="confirm-password">Confirm password</FormLabel>
            <InputGroup size="md">
              <Input
                isInvalid={!!errors['confirm-password']}
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="flushed"
                p={4}
                ref={confirmPassword}
                _autofill={autoFillStyles}
                onChange={e => validateConfirmPassword(e.target.value)}
                disabled={disableForm}
                required
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() =>
                    setShowConfirmPassword(prevState => !prevState)
                  }
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            {!!errors['confirm-password'] && (
              <FormHelperText color={errorColor}>
                {errors['confirm-password']}
              </FormHelperText>
            )}
          </FormControl>
        )}
        <Box>
          <Button
            // width="100%"
            type="submit"
            backgroundColor={submitBgColor}
            color={submitTextColor}
            disabled={!canSubmit || disableForm}
            isLoading={isLoading}
            mr={6}
            pr={10}
            pl={10}
          >
            {signIn ? 'Log In' : 'Register'}
          </Button>
          {signIn ? (
            <NextLink href="/register" passHref>
              <Link mt={6} mb={10} color={linkColor}>
                I don&apos;t have an account
              </Link>
            </NextLink>
          ) : (
            <NextLink href="/login" passHref>
              <Link mt={6} mb={10} color={linkColor}>
                I have an account
              </Link>
            </NextLink>
          )}
        </Box>
      </Box>
    </Flex>
  );
};
