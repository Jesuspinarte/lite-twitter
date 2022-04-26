import { PropsWithChildren, useContext, useState } from 'react';
import { User } from '../graphql/generated/graphql';

import { createContext } from 'react';

interface ProviderProps {
  user: User | null;
}

type UserContextProps = ProviderProps & {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

type UserProviderProps = PropsWithChildren<ProviderProps>;

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

export const useUserContext = () => useContext(UserContext);

const UserProvider: React.FC<UserProviderProps> = ({
  children,
  user: newUser,
}) => {
  const [user, setUser] = useState(newUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
