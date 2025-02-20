import { useState, ReactNode, useEffect } from "react";
import { AuthContext } from ".";
import { deleteToken, storeToken } from "../utils/storage";
import { authMeQuery } from "../api/auth";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const authMe = authMeMutation();
  const { data, isLoading, isError } = authMeQuery();

  useEffect(() => {
    if (data) {
      console.log(data);
      setAuthUser(data.user);
      storeToken(data.token);
    }
    if (isLoading) setAuthLoading(true);
    else setAuthLoading(false);

    if (isError) {
      console.log("error");
    }

  }, [data, isLoading, isError]);

  function clearUserLogin() {
    setIsAuthenticated(false);
    deleteToken();
    setUser(null);
  }

  function logout() {
    clearUserLogin();
  }

  function setAuthUser(user: any) {
    if (!user) {
      clearUserLogin();
      return;
    }
    setUser(user);
    setIsAuthenticated(true);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, setAuthLoading, isAuthenticated, setIsAuthenticated, logout, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
