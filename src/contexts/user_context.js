import React from "react";
import { auth, provider } from "../firebase";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState();

  const value = React.useMemo(
    () => ({
      user,
      setUser
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUserContext = () => {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be called with a <UserProvider />");
  }

  const signIn = React.useCallback(() => {
    const fetchData = async () => {
      auth.signInWithPopup(provider).then(result => {
        const user = result.user;
        context.setUser(user);
      });
    };
    fetchData();
  }, [context.setUser]);

  const signOut = React.useCallback(() => {
    auth.signOut().then(() => {
      context.setUser();
    });
  }, [context.setUser]);

  const persistUser = React.useCallback(
    user => {
      context.setUser(user);
    },
    [context.setUser]
  );

  const value = React.useMemo(
    () => ({
      state: {
        user: context.user
      },
      actions: {
        persistUser,
        signIn,
        signOut
      }
    }),
    [context.user, persistUser, signIn, signOut]
  );

  return value;
};

export { UserProvider, useUserContext };
