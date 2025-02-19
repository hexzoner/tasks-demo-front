import { useState, ReactNode, useEffect } from "react";
import { AuthContext } from ".";
import { restoreToken, deleteToken } from "../utils/storage";
// import { meApi } from "../api/auth";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!restoreToken()) {
      setAuthLoading(false);
      return;
    }
    const checkMe = async () => {
      if (!restoreToken()) {
        setAuthUser(null);
        return;
      }
      try {
        setAuthLoading(true);
        // const user = await meApi(restoreToken());
        setUser(user);
        // console.log(user);
        setIsAuthenticated(true);
      } catch (err) {
        console.log(err);
        clearUserLogin();
      } finally {
        setAuthLoading(false);
      }
    };

    checkMe();
  }, []);

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
