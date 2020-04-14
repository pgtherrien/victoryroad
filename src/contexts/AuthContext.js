import React from "react";

const AuthContext = React.createContext();

export const AuthConsumer = AuthContext.Consumer;
export const AuthProvider = AuthContext.Provider;

export default AuthContext;
