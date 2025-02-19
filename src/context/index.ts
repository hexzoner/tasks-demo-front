import { createContext, useContext } from "react";
import AuthContextProvider from "./AuthContextProvider";

// AuthContext -----------------------------------------------------
interface AuthContextProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  authLoading: boolean;
  setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthUser: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => { },
  setAuthUser: () => { },
  authLoading: true,
  setAuthLoading: () => { },
  isAuthenticated: false,
  setIsAuthenticated: () => { },
  logout: () => { },
});

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthContextProvider");
  return context;
};


export { AuthContext, useAuth, AuthContextProvider };
