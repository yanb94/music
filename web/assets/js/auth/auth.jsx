import React, { useContext } from "react";

const authObject = {
  auth: {
    token: null,
    isAuth: false,
    id: null,
    artist: false,
    isSubscribe: false
  },
  login: (auth) => {},
  logout: () => {},
  updateAuth: (auth) => {} 
}

const AuthContext = React.createContext(authObject)

function AuthProvider({children, value})
{
  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
}

function useAuth()
{
  return useContext(AuthContext);
}

export {AuthProvider, AuthContext, useAuth}